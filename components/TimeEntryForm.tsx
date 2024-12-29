'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'

export default function TimeEntryForm({ userId }: { userId: string }) {
  const [client, setClient] = useState('')
  const [workDate, setWorkDate] = useState('')
  const [stunden, setStunden] = useState('')
  const [zmsd, setZmsd] = useState('')
  const [rate, setRate] = useState('')
  const [notes, setNotes] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [performance, setPerformance] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: userData } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', userId)
        .single()

      if (!userData) {
        throw new Error('User not found')
      }

      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          employeeName: userData.name,
          client,
          workDate,
          stunden: parseFloat(stunden),
          zmsd,
          rate: rate ? parseFloat(rate) : null,
          notes,
          orderNumber,
          performance,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit time entry')
      }

      toast({
        title: "Success",
        description: "Time entry saved successfully",
      })

      // Reset form fields
      setClient('')
      setWorkDate('')
      setStunden('')
      setZmsd('')
      setRate('')
      setNotes('')
      setOrderNumber('')
      setPerformance('')

      router.refresh()
    } catch (error) {
      console.error('Error saving time entry:', error)
      toast({
        title: "Error",
        description: "Failed to save time entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Input
          id="client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="stunden">Stunden</Label>
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
      <div className="space-y-2">
        <Label htmlFor="zmsd">ZMSD</Label>
        <Input
          id="zmsd"
          value={zmsd}
          onChange={(e) => setZmsd(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rate">Rate (€/st)</Label>
        <Input
          id="rate"
          type="number"
          step="0.01"
          min="0"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Order Number</Label>
        <Input
          id="orderNumber"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="performance">Performance</Label>
        <Input
          id="performance"
          value={performance}
          onChange={(e) => setPerformance(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Log Time'}
      </Button>
    </motion.form>
  )
}

