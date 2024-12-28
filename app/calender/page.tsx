import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '../components/Navigation'
import { redirect } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'

export default async function CalendarPage() {
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

  // Fetch time entries for the current month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

  const { data: timeEntries, error: timeEntriesError } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userProfile.id)
    .gte('start_time', startOfMonth)
    .lte('start_time', endOfMonth)

  if (timeEntriesError) {
    console.error('Error fetching time entries:', timeEntriesError)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={userProfile.role} user={userProfile} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-primary mb-6">Time Entry Calendar</h1>
          <Calendar
            mode="multiple"
            selected={timeEntries?.map(entry => new Date(entry.start_time)) || []}
            className="rounded-md border"
          />
        </div>
      </main>
    </div>
  )
}

