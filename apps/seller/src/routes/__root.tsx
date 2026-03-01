import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'
import { initAuth } from '@ecomm/api'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    initAuth().then(() => setAuthReady(true))
  }, [])

  if (!authReady) return null

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="p-4 bg-white border-b shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-black text-blue-600">SELLER DASHBOARD</h1>
        <button onClick={() => window.location.href = 'http://localhost:3000'} className="text-sm font-bold text-gray-500">Back to Shop</button>
      </nav>
      <main className="p-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}
