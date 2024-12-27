import Link from 'next/link'

const Navigation = ({ role }: { role: string }) => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
        {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
          <>
            <li><Link href="/employees" className="hover:text-blue-200">Employees</Link></li>
            <li><Link href="/reports" className="hover:text-blue-200">Reports</Link></li>
          </>
        )}
        {role === 'SUPER_ADMIN' && (
          <li><Link href="/admins" className="hover:text-blue-200">Admins</Link></li>
        )}
        <li><Link href="/logout" className="hover:text-blue-200">Logout</Link></li>
      </ul>
    </nav>
  )
}

export default Navigation

