import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '@ecomm/api'
import { useState } from 'react'
import { Star, ShieldCheck, Truck, ArrowLeft, ShoppingCart, Heart, Share2, Info, Check } from 'lucide-react'
import { useCart } from '../lib/CartContext'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetails,
})

function ProductDetails() {
  const { productId } = Route.useParams()
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  })

  const [activeImage, setActiveImage] = useState<string | null>(null)
  const [zoom, setZoom] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (isLoading) return <div className="animate-pulse py-20 text-center font-black text-gray-400 uppercase tracking-widest">Synchronizing Product Data...</div>
  if (!product) return <div className="py-20 text-center font-black text-gray-400">PRODUCT NOT FOUND</div>

  const mainImage = activeImage || product.imageUrl
  const allImages = [product.imageUrl, ...(product.additionalImages || [])]

  return (
    <div className="space-y-16 pb-24">
      <Link to="/products" className="inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-400 transition-colors hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Return to Collection
      </Link>

      <div className="grid gap-20 lg:grid-cols-2">
        {/* Image Gallery Section */}
        <div className="space-y-8">
          <div 
            className="relative aspect-square overflow-hidden rounded-[3rem] bg-white shadow-2xl shadow-blue-100/50 cursor-zoom-in group"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              className={`h-full w-full object-cover transition-transform duration-700 ${zoom ? 'scale-150' : 'scale-100'}`}
              style={zoom ? { transformOrigin: 'center' } : {}}
            />
            <div className="absolute right-8 top-8 flex flex-col gap-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
              <button className="rounded-full bg-white p-4 shadow-xl text-gray-900 transition-all hover:scale-110 active:scale-95">
                <Heart className="h-5 w-5" />
              </button>
              <button className="rounded-full bg-white p-4 shadow-xl text-gray-900 transition-all hover:scale-110 active:scale-95">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {allImages.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImage(img)}
                className={`h-28 w-28 flex-shrink-0 overflow-hidden rounded-3xl border-4 transition-all ${
                  mainImage === img ? 'border-blue-600 scale-105 shadow-xl' : 'border-white opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col justify-center space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-blue-600 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-base font-black text-gray-900">{product.rating || '5.0'}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">({product.reviewCount || '0'} Reviews)</span>
              </div>
            </div>
            <h1 className="text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">{product.name}</h1>
            <p className="text-5xl font-black text-blue-600 tracking-tighter">${product.price.toFixed(2)}</p>
          </div>

          <p className="text-xl font-medium leading-relaxed text-gray-500">
            {product.description}
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border-2 border-gray-100 bg-white p-8 transition-all hover:border-blue-100">
              <div className="flex items-center gap-4 text-blue-600">
                <div className="p-3 bg-blue-50 rounded-2xl">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">Premium Assurance</span>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500 leading-relaxed">100% Genuine product guaranteed with a global certified warranty.</p>
            </div>
            <div className="rounded-[2rem] border-2 border-gray-100 bg-white p-8 transition-all hover:border-green-100">
              <div className="flex items-center gap-4 text-green-600">
                <div className="p-3 bg-green-50 rounded-2xl">
                    <Truck className="h-6 w-6" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">Global Logistics</span>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500 leading-relaxed">Complimentary priority shipping on all orders exceeding $500.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-8">
            <Link 
              to="/checkout" 
              search={{ productId: product.id.toString(), quantity: 1 }}
              className="group flex flex-[2] items-center justify-center gap-4 rounded-[2.5rem] bg-gray-900 py-7 text-xl font-black text-white shadow-2xl transition-all hover:bg-gray-800 hover:scale-[1.02] active:scale-95"
            >
              <ShoppingCart className="h-6 w-6" />
              INSTANT PURCHASE
            </Link>
            <button 
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-3 rounded-[2.5rem] border-2 py-7 text-xl font-black transition-all ${
                    isAdded ? 'bg-green-50 border-green-600 text-green-600' : 'border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50'
                }`}
            >
              {isAdded ? <Check className="h-6 w-6 animate-in zoom-in" /> : null}
              {isAdded ? 'ADDED' : 'ADD TO CART'}
            </button>
          </div>
          
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-8 py-5 text-amber-800 border border-amber-100">
            <Info className="h-5 w-5" />
            <p className="text-xs font-black uppercase tracking-widest">
              Limited Reserve: Only {product.stockQuantity} units remaining in the global ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <section className="mt-32 space-y-12 border-t border-gray-100 pt-32">
        <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Expert Appraisals</h2>
            <button className="text-sm font-black text-blue-600 uppercase tracking-widest hover:underline">Write a Review</button>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {[
            { user: "Alexander J.", rating: 5, comment: "Absolutely breathtaking performance. The build quality is second to none. A masterpiece of engineering.", date: "2 days ago" },
            { user: "Sarah K.", rating: 5, comment: "Worth every single penny. This has completely transformed my creative workflow. Highly recommended.", date: "1 week ago" }
          ].map((rev, i) => (
            <div key={i} className="rounded-[3rem] bg-gray-50 p-12 transition-all hover:shadow-xl hover:bg-white border border-transparent hover:border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-100">
                    {rev.user[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">{rev.user}</h4>
                    <div className="flex text-amber-400 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{rev.date}</span>
              </div>
              <p className="mt-8 text-lg font-medium leading-relaxed text-gray-600 italic">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
