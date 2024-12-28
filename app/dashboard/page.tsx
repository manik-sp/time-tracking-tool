import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import TimeEntryForm from '@/components/TimeEntryForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Calendar, BarChart } from 'lucide-react'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: userProfile, error } = await supabase
    .from('user_profiles')
    .select('id, role, name, email')
    .eq('id', session.user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    redirect('/error')
  }

  if (!userProfile) {
    console.error('User profile not found')
    redirect('/complete-profile')
  }

  // Fetch summary statistics
  const { data: summaryData, error: summaryError } = await supabase
    .from('time_entries')
    .select('start_time, end_time')
    .eq('user_id', userProfile.id)
    .gte('start_time', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString())

  if (summaryError) {
    console.error('Error fetching summary data:', summaryError)
  }

  const totalHours = summaryData?.reduce((acc, entry) => {
    if (entry.end_time) {
      const duration = new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()
      return acc + duration / 3600000 // Convert milliseconds to hours
    }
    return acc
  }, 0) || 0

  const entriesThisMonth = summaryData?.length || 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={userProfile.role} user={userProfile} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-primary mb-6">Welcome, {userProfile.name}</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours This Month</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entries This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entriesThisMonth}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Hours Per Entry</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entriesThisMonth > 0 ? (totalHours / entriesThisMonth).toFixed(2) : '0.00'}</div>
              </CardContent>
            </Card>
          </div>
          {userProfile.role === 'EMPLOYEE' && (
            <Card>
              <CardHeader>
                <CardTitle>Log Your Time</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeEntryForm userId={userProfile.id} />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

