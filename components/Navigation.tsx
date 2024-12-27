import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const Navigation = ({ role }: { role: string }) => {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-primary">
                TimeTrack Pro
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-primary text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
                <>
                  <Link href="/employees" className="border-transparent text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Employees
                  </Link>
                  <Link href="/reports" className="border-transparent text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Reports
                  </Link>
                </>
              )}
              {role === 'SUPER_ADMIN' && (
                <Link href="/admins" className="border-transparent text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Admins
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ThemeToggle />
            <div className="ml-3 relative">
              <Link href="/logout" className="text-muted-foreground hover:text-primary">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

