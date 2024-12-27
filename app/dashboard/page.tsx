import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '../components/Navigation'
import TimeEntryForm from '../components/TimeEntryForm'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userProfile, error } = await supabase
    .from('user_profiles')
    .select('id, role, name')
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={userProfile.role} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-primary mb-6">Welcome, {userProfile.name}</h1>
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
          {/* Add more dashboard content here */}
        </div>
      </main>
    </div>
  )
}

