'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { differenceInMinutes, addMinutes, format } from 'date-fns'

export default function TimeEntryForm({ userId }: { userId: string }) {
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [duration, setDuration] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      const diff = differenceInMinutes(end, start)
      setDuration(diff.toString())
    }
  }, [startTime, endTime])

  useEffect(() => {
    if (startTime && duration) {
      const start = new Date(startTime)
      const end = addMinutes(start, parseInt(duration))
      setEndTime(format(end, "yyyy-MM-dd'T'HH:mm"))
    }
  }, [startTime, duration])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('time_entries')
        .insert([
          { user_id: userId, description, start_time: startTime, end_time: endTime },
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Time entry saved successfully",
      })
      setDescription('')
      setStartTime('')
      setEndTime('')
      setDuration('')
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          type="datetime-local"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min="1"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Log Time'}
      </Button>
    </form>
  )
}

