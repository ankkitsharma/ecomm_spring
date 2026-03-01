import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { initAuth } from "@ecomm/api"
import { Navbar } from "../components/Navbar"
import { CartProvider } from "../lib/CartContext"
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
    initAuth().then(() => {
        setAuthReady(true)
    }).catch(() => {
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
          <CartProvider>
            {!authReady ? (
                <div className="flex h-screen flex-col items-center justify-center bg-white text-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-xl"></div>
                    <p className="mt-8 text-xs font-black uppercase tracking-widest text-gray-400">Synchronizing Ecosystem...</p>
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
          </CartProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
