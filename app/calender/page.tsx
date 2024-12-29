import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '@/components/Navigation'
import { redirect } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { PageTransition } from '@/components/page-transition'
import { AnimatedCard } from '@/components/animated-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export default async function CalendarPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
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

  // Fetch time entries for the current month
  const today = new Date()
  const startOfMonthDate = startOfMonth(today)
  const endOfMonthDate = endOfMonth(today)

  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('time_entries')
    .select('work_date, stunden')
    .eq('user_id', userProfile.id)
    .gte('work_date', startOfMonthDate.toISOString())
    .lte('work_date', endOfMonthDate.toISOString())

  if (timeEntriesError) {
    console.error('Error fetching time entries:', timeEntriesError)
  }

  // Group time entries by date
  const timeEntriesByDate = timeEntries?.reduce((acc, entry) => {
    const date = new Date(entry.work_date).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += entry.stunden
    return acc
  }, {})

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation role={userProfile.role} user={userProfile} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-primary mb-6">Time Entry Calendar</h1>
            <AnimatedCard>
              <Card>
                <CardHeader>
                  <CardTitle>{format(today, 'MMMM yyyy')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="multiple"
                    selected={Object.keys(timeEntriesByDate || {}).map(date => new Date(date))}
                    className="rounded-md border"
                    components={{
                      DayContent: ({ date, ...props }) => {
                        const formattedDate = date.toISOString().split('T')[0]
                        const hours = timeEntriesByDate?.[formattedDate]
                        return (
                          <div className="flex flex-col items-center">
                            <div {...props} />
                            {hours && (
                              <div className="text-xs mt-1 font-medium">
                                {hours}h
                              </div>
                            )}
                          </div>
                        )
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

