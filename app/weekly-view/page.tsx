// app/weekly-view/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'
import { PageTransition } from '@/components/page-transition'
import { AnimatedCard } from '@/components/animated-card'

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

  // Fetch time entries for the current week
  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('time_entries')
    .select('work_date, stunden')
    .eq('user_id', userProfile.id)
    .gte('work_date', weekStart.toISOString())
    .lte('work_date', weekEnd.toISOString())

  if (timeEntriesError) {
    console.error('Error fetching time entries:', timeEntriesError)
  }

  // Group time entries by date
  const groupedEntries = daysOfWeek.map(day => {
    const dayEntries = timeEntries?.filter(entry => 
      new Date(entry.work_date).toDateString() === day.toDateString()
    ) || []
    return {
      date: day,
      entries: dayEntries,
      totalHours: dayEntries.reduce((acc, entry) => acc + entry.stunden, 0)
    }
  })

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation role={userProfile.role} user={userProfile} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-primary mb-6">Weekly Time Entries</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupedEntries.map((day, index) => (
                <AnimatedCard key={day.date.toISOString()} delay={index * 0.1}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{format(day.date, 'EEEE, MMM d')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-2">{day.totalHours.toFixed(2)} hours</p>
                      <ul className="space-y-2">
                        {day.entries.map((entry) => (
                          <li key={entry.work_date} className="text-sm">
                            {entry.stunden}h - {entry.client || 'No client'}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}