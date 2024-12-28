import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '../components/Navigation'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'

export default async function WeeklyViewPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userProfile, error } = await supabase
    .from('user_profiles')
    .select('id, role, name, email, avatar_url')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    redirect('/error')
  }

  if (!userProfile) {
    console.error('User profile not found')
    redirect('/complete-profile')
  }

  const today = new Date()
  const weekStart = startOfWeek(today)
  const weekEnd = endOfWeek(today)
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userProfile.id)
    .gte('start_time', weekStart.toISOString())
    .lte('start_time', weekEnd.toISOString())

  if (timeEntriesError) {
    console.error('Error fetching time entries:', timeEntriesError)
  }

  const groupedEntries = daysOfWeek.map(day => {
    const dayEntries = timeEntries?.filter(entry => 
      new Date(entry.start_time).toDateString() === day.toDateString()
    ) || []
    return {
      date: day,
      entries: dayEntries,
      totalHours: dayEntries.reduce((acc, entry) => {
        if (entry.end_time) {
          const duration = new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()
          return acc + duration / 3600000 // Convert milliseconds to hours
        }
        return acc
      }, 0)
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={userProfile.role} user={userProfile} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-primary mb-6">Weekly Time Entries</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedEntries.map((day) => (
              <Card key={day.date.toISOString()}>
                <CardHeader>
                  <CardTitle>{format(day.date, 'EEEE, MMM d')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-2">{day.totalHours.toFixed(2)} hours</p>
                  <ul className="space-y-2">
                    {day.entries.map((entry) => (
                      <li key={entry.id} className="text-sm">
                        {format(new Date(entry.start_time), 'HH:mm')} - {entry.end_time ? format(new Date(entry.end_time), 'HH:mm') : 'Ongoing'}
                        <br />
                        {entry.description}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

