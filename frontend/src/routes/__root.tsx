import { createRootRoute, Link, Outlet, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm p-4 flex gap-4 border-b">
              <Link to="/" className="font-bold text-blue-600">Home</Link>
              <Link to="/products" className="hover:text-blue-500">Products</Link>
              <Link to="/protected" className="hover:text-blue-500">Protected Profile</Link>
            </nav>
            <main className="p-4 max-w-4xl mx-auto">
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
