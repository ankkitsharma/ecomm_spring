import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '../lib/api'
import { useState } from 'react'
import { Star, ShieldCheck, Truck, ArrowLeft, ShoppingCart, Heart, Share2, Info } from 'lucide-react'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetails,
})

function ProductDetails() {
  const { productId } = Route.useParams()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  })

  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [zoom, setZoom] = useState(false)

  if (isLoading) return <div className="animate-pulse py-20 text-center font-black text-gray-400">Loading Product Excellence...</div>
  if (!product) return <div>Product Not Found</div>

  const mainImage = activeImage || product.imageUrl
  const allImages = [product.imageUrl, ...(product.additionalImages || [])]

  return (
    <div className="space-y-12 pb-20">
      <Link to="/products" className="inline-flex items-center gap-2 font-bold text-gray-500 transition-colors hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to Collection
      </Link>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Image Gallery Section */}
        <div className="space-y-6">
          <div 
            className="relative aspect-square overflow-hidden rounded-[3rem] bg-gray-100 shadow-2xl cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              className={`h-full w-full object-cover transition-transform duration-500 ${zoom ? 'scale-150' : 'scale-100'}`}
              style={zoom ? { transformOrigin: 'center' } : {}}
            />
            <div className="absolute right-6 top-6 flex flex-col gap-3">
              <button className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110">
                <Heart className="h-5 w-5 text-gray-900" />
              </button>
              <button className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110">
                <Share2 className="h-5 w-5 text-gray-900" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {allImages.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImage(img)}
                className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                  mainImage === img ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-black text-gray-900">{product.rating}</span>
                <span className="text-xs font-bold text-gray-400">({product.reviewCount} Reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900">{product.name}</h1>
            <p className="text-4xl font-black text-blue-600">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-lg font-medium leading-relaxed text-gray-500">
            {product.description}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-gray-50/50 p-6">
              <div className="flex items-center gap-3 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-bold">Authenticity</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500">100% Genuine product guaranteed with certified warranty.</p>
            </div>
            <div className="rounded-2xl border bg-gray-50/50 p-6">
              <div className="flex items-center gap-3 text-green-600">
                <Truck className="h-5 w-5" />
                <span className="font-bold">Fast Shipping</span>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500">Free delivery on orders over $500. track your order live.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <Link 
              to="/checkout" 
              search={{ productId: product.id.toString(), quantity: 1 }}
              className="group flex flex-[2] items-center justify-center gap-3 rounded-[2rem] bg-gray-900 py-6 text-lg font-black text-white shadow-2xl transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-95"
            >
              <ShoppingCart className="h-5 w-5" />
              Instant Purchase
            </Link>
            <button className="flex flex-1 items-center justify-center rounded-[2rem] border-2 border-gray-200 py-6 text-lg font-black text-gray-900 transition-all hover:border-gray-900 hover:bg-gray-50">
              Add to Cart
            </button>
          </div>
          
          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-6 py-4 text-amber-800">
            <Info className="h-5 w-5" />
            <p className="text-xs font-bold uppercase tracking-wider">
              Only {product.stockQuantity} units left in stock — Order soon!
            </p>
          </div>
        </div>
      </div>

      {/* Review Section (Mock) */}
      <section className="mt-20 space-y-10 border-t pt-20">
        <h2 className="text-3xl font-black tracking-tight text-gray-900">Expert Reviews</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { user: "Alex J.", rating: 5, comment: "Absolutely breathtaking performance. The build quality is second to none.", date: "2 days ago" },
            { user: "Sarah K.", rating: 5, comment: "Expensive but worth every single penny. Game changer for my workflow.", date: "1 week ago" }
          ].map((rev, i) => (
            <div key={i} className="rounded-[2.5rem] bg-gray-50 p-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600">
                    {rev.user[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{rev.user}</h4>
                    <div className="flex text-amber-400">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-current" />)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400">{rev.date}</span>
              </div>
              <p className="mt-6 font-medium leading-relaxed text-gray-600 italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
