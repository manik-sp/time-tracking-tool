import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Oops! Something went wrong</h1>
        <p className="text-xl text-muted-foreground mb-8">We're sorry, but an unexpected error occurred.</p>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

