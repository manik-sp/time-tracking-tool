import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from '../components/Navigation'
import { redirect } from 'next/navigation'
import EmployeeList from './EmployeeList'

export default async function Employees() {
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

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <main>
      <Navigation role={user.role} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Employees</h1>
        <EmployeeList />
      </div>
    </main>
  )
}

