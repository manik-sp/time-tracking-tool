import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Navigation from '@/components/Navigation'
import TimeEntryForm from '@/components/TimeEntryForm'
import AddClientForm from '@/components/AddClientForm'
import WeeklySummary from '@/components/WeeklySummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Calendar, BarChart, Users } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import { AnimatedCard } from '@/components/animated-card'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/login')
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, role, name, email')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      throw profileError
    }

    if (!userProfile) {
      redirect('/complete-profile')
    }

    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navigation role={userProfile.role} user={userProfile} />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-3xl font-bold text-primary mb-6">Welcome, {userProfile.name}</h1>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <AnimatedCard delay={0.1}>
                  <WeeklySummary userId={userProfile.id} />
                </AnimatedCard>
                <AnimatedCard delay={0.2}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Add New Client</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <AddClientForm userId={userProfile.id} />
                    </CardContent>
                  </Card>
                </AnimatedCard>
                {userProfile.role === 'EMPLOYEE' && (
                  <AnimatedCard delay={0.3}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Log Your Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TimeEntryForm userId={userProfile.id} />
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                )}
              </div>
              
            </div>
          </main>
        </div>
      </PageTransition>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    redirect('/error')
  }
}

