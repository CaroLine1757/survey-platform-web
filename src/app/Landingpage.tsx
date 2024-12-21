import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">Conversify</span>
        </h1>
        <p className="mt-3 text-2xl">
          AI-powered conversational surveying made easy
        </p>
        <div className="flex mt-6">
          <Link href="/register">
            <Button className="mr-4">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

