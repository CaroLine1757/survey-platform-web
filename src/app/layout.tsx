import '@/styles/globals.css'
import { Outfit } from 'next/font/google'
import { AuthProvider } from '@/components/AuthContext'
import Navigation from '@/components/Navigation'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata = {
  title: 'Conversify',
  description: 'AI-powered conversational surveying tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

