import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"

export const Route = createFileRoute("/products")({
  component: Products,
})

interface Product {
  id: number
  name: string
  description: string
  price: number
}

function Products() {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/products")
      return res.data
    },
  })

  if (isLoading) return <div>Loading products...</div>
  if (error) return <div>Error loading products.</div>

  return (
    <div className="py-8">
      <h1 className="mb-6 text-3xl font-bold">Our Products</h1>
      <div className="grid grid-cols-1 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="rounded border bg-white p-4 shadow">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="mt-2 font-bold text-blue-600">${product.price}</p>
          </div>
        ))}
        {products?.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
