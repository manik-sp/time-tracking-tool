'use client'

import { useEffect } from 'react'

export default function TestPage() {
  useEffect(() => {
    console.log('Test page client-side code is running')
  }, [])

  return (
    <div>
      <h1>Test Page</h1>
      <p>If you can see this, Next.js is serving pages correctly.</p>
      <p>Check the console for a log message.</p>
    </div>
  )
}

