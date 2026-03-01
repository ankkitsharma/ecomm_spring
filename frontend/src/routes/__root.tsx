import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { initAuth } from "../lib/auth"
import { Navbar } from "../components/Navbar"
import styles from "../styles.css?url"

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "E-Store | Premium Shopping Experience" },
    ],
    links: [{ rel: "stylesheet", href: styles }],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    // Only run on client
    console.log('Client-side useEffect triggered')
    initAuth().then(() => {
        console.log('initAuth finished successfully')
        setAuthReady(true)
    }).catch(err => {
        console.error('initAuth failed:', err)
        setAuthReady(true)
    })
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50 font-sans text-gray-900 antialiased">
        <QueryClientProvider client={queryClient}>
          {!authReady ? (
            <div className="flex h-screen flex-col items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-xl shadow-blue-100"></div>
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Initializing E-Store</p>
                <button 
                  onClick={() => setAuthReady(true)}
                  className="mt-8 rounded-full bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-lg transition-all active:scale-95"
                >
                  Force Start App
                </button>
              </div>
            </div>
          ) : (
            <>
              <Navbar />
              <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
              </main>
            </>
          )}
          <TanStackRouterDevtools />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
