import { createRootRoute, Link, Outlet, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { initAuth, isAuthenticated, login, logout } from '../lib/auth'
import styles from '../styles.css?url'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'E-Comm App' },
    ],
    links: [
      { rel: 'stylesheet', href: styles },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    initAuth().then(() => setAuthReady(true))
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
              <div className="flex gap-4 items-center">
                <Link to="/" className="font-bold text-blue-600 text-xl mr-4">E-Store</Link>
                <Link to="/products" className="hover:text-blue-500 font-medium text-gray-700">Products</Link>
                <Link to="/protected" className="hover:text-blue-500 font-medium text-gray-700">Protected Profile</Link>
              </div>
              
              <div className="flex gap-3">
                {!authReady ? (
                  <span className="text-gray-400 text-sm">Loading Auth...</span>
                ) : isAuthenticated() ? (
                  <button 
                    onClick={() => logout()}
                    className="bg-red-50 text-red-600 px-4 py-1.5 rounded-md border border-red-100 hover:bg-red-100 transition-colors text-sm font-semibold"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => login()}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
                    >
                      Login / Register
                    </button>
                  </div>
                )}
              </div>
            </nav>
            <main className="p-4 max-w-5xl mx-auto">
              <Outlet />
            </main>
          </div>
          <TanStackRouterDevtools />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
