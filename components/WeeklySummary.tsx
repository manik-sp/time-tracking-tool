// app/components/WeeklySummary.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { startOfWeek, endOfWeek } from 'date-fns'

// Default export for the component
export default function WeeklySummary({ userId }: { userId: string }) {
  const [totalHours, setTotalHours] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        const today = new Date()
        const weekStart = startOfWeek(today)
        const weekEnd = endOfWeek(today)

        // Fetch time entries for the current week
        const { data, error } = await supabase
          .from('time_entries')
          .select('stunden')
          .eq('user_id', userId)
          .gte('work_date', weekStart.toISOString())
          .lte('work_date', weekEnd.toISOString())

        if (error) {
          throw error
        }

        // Calculate total hours for the week
        const total = data.reduce((acc, entry) => acc + (entry.stunden || 0), 0)
        setTotalHours(total)
      } catch (error) {
        console.error('Error fetching weekly summary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklySummary()
  }, [userId, supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p className="text-2xl font-bold">{totalHours.toFixed(2)} hours</p>
        )}
      </CardContent>
    </Card>
  )
}