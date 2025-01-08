// app/components/TimeEntryForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TimeEntryForm({ userId, employeeName }: { userId: string; employeeName: string }) {
  const [client, setClient] = useState('')
  const [clients, setClients] = useState<string[]>([]) // List of clients from the database
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]) // Default to today's date
  const [stunden, setStunden] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [performance, setPerformance] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch clients from the database
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients')
        const data = await response.json()
        if (response.ok) {
          setClients(data)
        } else {
          throw new Error(data.error || 'Failed to fetch clients')
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch clients.',
          variant: 'destructive',
        })
      }
    }

    fetchClients()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send a POST request to the API route
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          employee_name: employeeName,
          client,
          work_date: workDate,
          stunden: parseFloat(stunden),
          rate: 50, // Fixed rate
          description,
          notes,
          order_number: orderNumber,
          performance,
        }),
      })

      const data = await response.json()

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log time')
      }

      // Display success message
      toast({
        title: 'Success',
        description: 'Time logged successfully.',
      })

      // Reset form fields
      setClient('')
      setStunden('')
      setDescription('')
      setNotes('')
      setOrderNumber('')
      setPerformance('')
    } catch (error) {
      console.error('Error logging time:', error)
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while logging time.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Client Selection */}
      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Select onValueChange={setClient} value={client} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Work Date */}
      <div className="space-y-2">
        <Label htmlFor="workDate">Work Date</Label>
        <Input
          id="workDate"
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          required
        />
      </div>

      {/* Stunden (Hours) */}
      <div className="space-y-2">
        <Label htmlFor="stunden">Stunden (Hours)</Label>
        <Input
          id="stunden"
          type="number"
          step="0.01"
          min="0.01"
          value={stunden}
          onChange={(e) => setStunden(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Order Number */}
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Order Number</Label>
        <Input
          id="orderNumber"
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
      </div>

      {/* Performance */}
      <div className="space-y-2">
        <Label htmlFor="performance">Performance</Label>
        <Input
          id="performance"
          type="text"
          value={performance}
          onChange={(e) => setPerformance(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging Time...' : 'Log Time'}
      </Button>
    </form>
  )
}