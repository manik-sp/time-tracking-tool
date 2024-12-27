import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleSansText } from '@/lib/fonts'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'TimeTrack Pro',
  description: 'Professional time tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GoogleSansText.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

