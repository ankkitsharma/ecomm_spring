import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export const Route = createFileRoute('/products')({
  component: Products,
})

function Products() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/api/products')
      return res.data
    },
  })

  if (isLoading) return <div>Loading products...</div>
  if (error) return <div>Error loading products.</div>

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 gap-4">
        {products?.map((product: any) => (
          <div key={product.id} className="p-4 bg-white shadow rounded border">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">${product.price}</p>
          </div>
        ))}
        {products?.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
