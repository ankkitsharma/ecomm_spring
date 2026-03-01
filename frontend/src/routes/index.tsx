import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="py-8">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">Welcome to E-Comm Store</h1>
      <p className="text-lg text-gray-600">
        A modern e-commerce boilerplate using TanStack Start and Spring Boot.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Public Products</h2>
          <p className="text-gray-600">Anyone can view our products list.</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold">Secure Auth</h2>
          <p className="text-gray-600">Login to see your protected profile and order history.</p>
        </div>
      </div>
    </div>
  )
}
