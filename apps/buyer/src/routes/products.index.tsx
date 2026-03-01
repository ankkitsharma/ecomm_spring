import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../lib/api'
import { Star } from 'lucide-react'

export const Route = createFileRoute('/products/')({
  component: ProductListing,
})

function ProductListing() {
  const navigate = useNavigate()
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  if (isLoading) return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="h-96 animate-pulse rounded-[2.5rem] bg-gray-200"></div>
      ))}
    </div>
  )

  return (
    <div className="space-y-12">
      <header className="relative overflow-hidden rounded-[3rem] bg-gray-900 px-10 py-20 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-6xl font-black leading-tight tracking-tight">
            The Future of <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Commerce.</span>
          </h1>
          <p className="mt-6 text-xl font-medium text-gray-400">
            Precision engineered electronics for the modern professional.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      </header>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product: any) => (
          <div
            key={product.id}
            onClick={() => navigate({ to: '/products/$productId', params: { productId: product.id.toString() } })}
            className="group flex cursor-pointer flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-blue-200/50 group-hover:-translate-y-3">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <button className="w-full rounded-2xl bg-white py-4 text-sm font-black text-gray-900 shadow-xl">
                  View Detail — ${product.price.toFixed(2)}
                </button>
              </div>
              <div className="absolute right-6 top-6 rounded-full bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 backdrop-blur-md shadow-lg">
                {product.categoryName}
              </div>
            </div>
            <div className="mt-8 px-4">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-black text-gray-900">{product.rating || '5.0'}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">({product.reviewCount || '0'})</span>
              </div>
              <h3 className="mt-3 text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm font-medium leading-relaxed text-gray-500">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
