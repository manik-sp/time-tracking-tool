'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { PageTransition } from '@/components/page-transition'
import { AnimatedCard } from '@/components/animated-card'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [userProfile, setUserProfile] = useState(null)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [weekStartDay, setWeekStartDay] = useState('Monday')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
        } else {
          setUserProfile(data)
          setEmailNotifications(data.email_notifications || false)
          setWeekStartDay(data.week_start_day || 'Monday')
        }
      } else {
        router.push('/login')
      }
    }

    fetchUserProfile()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          email_notifications: emailNotifications,
          week_start_day: weekStartDay,
        })
        .eq('id', userProfile.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!userProfile) {
    return <div>Loading...</div>
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navigation role={userProfile.role} user={userProfile} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>
            <AnimatedCard>
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch
                        id="emailNotifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekStartDay">Week Start Day</Label>
                      <select
                        id="weekStartDay"
                        value={weekStartDay}
                        onChange={(e) => setWeekStartDay(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                      </select>
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </motion.form>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

