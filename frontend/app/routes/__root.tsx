import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Meta, Scripts } from '@tanstack/react-start'

export const Route = createRootRoute({
  component: () => (
    <html lang="en">
      <head>
        <Meta />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>E-Comm App</title>
      </head>
      <body>
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
        <Scripts />
        <TanStackRouterDevtools />
      </body>
    </html>
  ),
})
