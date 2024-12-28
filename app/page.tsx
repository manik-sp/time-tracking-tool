import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">TimeTracking Pro</CardTitle>
          <CardDescription className="text-center">Professional time tracking solution by Digibiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Efficiently manage your time and boost productivity with our advanced time tracking tool.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

