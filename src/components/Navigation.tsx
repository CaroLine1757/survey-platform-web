import Link from 'next/link'
import { Button } from "src/components/ui/button"
import { useAuth } from 'src/components/AuthContext'

export default function Navigation() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Conversify</Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/home">
                <Button variant="ghost">Home</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="ghost">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

