import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '../components/Navigation'
import { redirect } from 'next/navigation'

export default async function Reports() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (user.role === 'EMPLOYEE') {
    redirect('/')
  }

  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select(`
      id,
      description,
      start_time,
      end_time,
      users (
        name
      )
    `)
    .order('start_time', { ascending: false })

  return (
    <main>
      <Navigation role={user.role} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Time Entry Reports</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Employee</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Start Time</th>
                <th className="py-3 px-6 text-left">End Time</th>
                <th className="py-3 px-6 text-left">Duration</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {timeEntries.map((entry) => {
                const startTime = new Date(entry.start_time)
                const endTime = entry.end_time ? new Date(entry.end_time) : null
                const duration = endTime
                  ? ((endTime.getTime() - startTime.getTime()) / 3600000).toFixed(2)
                  : 'In progress'

                return (
                  <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{entry.users.name}</td>
                    <td className="py-3 px-6 text-left">{entry.description}</td>
                    <td className="py-3 px-6 text-left">{startTime.toLocaleString()}</td>
                    <td className="py-3 px-6 text-left">{endTime ? endTime.toLocaleString() : 'In progress'}</td>
                    <td className="py-3 px-6 text-left">{duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

