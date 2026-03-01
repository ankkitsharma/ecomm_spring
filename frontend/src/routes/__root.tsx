import { createRootRoute, Link, Outlet, HeadContent, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { initAuth, isAuthenticated, login, logout } from "../lib/auth"
import styles from "../styles.css?url"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "E-Comm App" },
    ],
    links: [{ rel: "stylesheet", href: styles }],
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
            <nav className="flex items-center justify-between border-b bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <Link to="/" className="mr-4 text-xl font-bold text-blue-600">
                  E-Store
                </Link>
                <Link to="/products" className="font-medium text-gray-700 hover:text-blue-500">
                  Products
                </Link>
                <Link to="/protected" className="font-medium text-gray-700 hover:text-blue-500">
                  Protected Profile
                </Link>
              </div>

              <div className="flex gap-3">
                {!authReady ? (
                  <span className="text-sm text-gray-400">Loading Auth...</span>
                ) : isAuthenticated() ? (
                  <button
                    onClick={() => logout()}
                    className="rounded-md border border-red-100 bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => login()}
                      className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                      Login / Register
                    </button>
                  </div>
                )}
              </div>
            </nav>
            <main className="mx-auto max-w-5xl p-4">
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
