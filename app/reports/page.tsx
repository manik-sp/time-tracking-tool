import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '../components/Navigation'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export default async function ReportsPage() {
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

  if (!userProfile || (userProfile.role !== 'ADMIN' && userProfile.role !== 'SUPER_ADMIN')) {
    redirect('/dashboard')
  }

  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('time_entries')
    .select(`
      *,
      user_profiles (
        name
      )
    `)
    .gte('start_time', monthStart.toISOString())
    .lte('start_time', monthEnd.toISOString())

  if (timeEntriesError) {
    console.error('Error fetching time entries:', timeEntriesError)
  }

  const userTotals = timeEntries?.reduce((acc, entry) => {
    const userId = entry.user_id
    if (!acc[userId]) {
      acc[userId] = {
        name: entry.user_profiles.name,
        totalHours: 0,
        entryCount: 0
      }
    }
    if (entry.end_time) {
      const duration = new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()
      acc[userId].totalHours += duration / 3600000 // Convert milliseconds to hours
    }
    acc[userId].entryCount++
    return acc
  }, {})

  const sortedUserTotals = Object.values(userTotals || {}).sort((a, b) => b.totalHours - a.totalHours)

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={userProfile.role} user={userProfile} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-primary mb-6">Monthly Report</h1>
          <Card>
            <CardHeader>
              <CardTitle>{format(today, 'MMMM yyyy')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Number of Entries</TableHead>
                    <TableHead>Average Hours per Entry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUserTotals.map((userTotal) => (
                    <TableRow key={userTotal.name}>
                      <TableCell>{userTotal.name}</TableCell>
                      <TableCell>{userTotal.totalHours.toFixed(2)}</TableCell>
                      <TableCell>{userTotal.entryCount}</TableCell>
                      <TableCell>{(userTotal.totalHours / userTotal.entryCount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

