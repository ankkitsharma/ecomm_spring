import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to E-Comm Store</h1>
      <p className="text-lg text-gray-600">
        A modern e-commerce boilerplate using TanStack Start and Spring Boot.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Public Products</h2>
          <p className="text-gray-600">Anyone can view our products list.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2">Secure Auth</h2>
          <p className="text-gray-600">Login to see your protected profile and order history.</p>
        </div>
      </div>
    </div>
  )
}
