import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { placeOrder, fetchProduct } from '../lib/api'
import { CreditCard, ShieldCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be MM/YY'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
  cardHolder: z.string().min(3, 'Card holder name is required'),
})

type PaymentData = z.infer<typeof paymentSchema>

export const Route = createFileRoute('/checkout')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      productId: search.productId as string,
      quantity: (search.quantity as number) || 1,
    }
  },
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()
  const { productId, quantity } = Route.useSearch()
  const [isSuccess, setIsSuccess] = useState(false)

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
  })

  const orderMutation = useMutation({
    mutationFn: (data: any) => placeOrder(data),
    onSuccess: () => {
      setIsSuccess(true)
      setTimeout(() => navigate({ to: '/buyer' }), 3000)
    },
  })

  const onSubmit = (data: PaymentData) => {
    if (!product) return
    orderMutation.mutate({
      items: [{
        productId: product.id,
        quantity: quantity,
      }]
    })
  }

  if (isSuccess) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 animate-in zoom-in duration-500">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="mt-8 text-4xl font-black text-gray-900">Payment Successful!</h1>
        <p className="mt-4 text-lg font-medium text-gray-500">Your order has been placed and is being processed.</p>
        <p className="mt-2 text-sm text-gray-400">Redirecting to your dashboard...</p>
      </div>
    )
  }

  if (productLoading) return <div className="animate-pulse py-12 text-center text-gray-400">Preparing secure checkout...</div>

  const total = (product?.price || 0) * quantity

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-500">Securely complete your purchase</p>
        </div>

        <div className="rounded-[2.5rem] bg-gray-900 p-8 text-white shadow-2xl">
          <div className="flex items-start justify-between">
            <CreditCard className="h-8 w-8 text-blue-400" />
            <div className="flex h-10 w-14 rounded-lg bg-gray-800 border border-gray-700"></div>
          </div>
          <div className="mt-12 space-y-6">
            <div className="text-xl font-medium tracking-[0.2em] opacity-40">•••• •••• •••• ••••</div>
            <div className="flex justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Card Holder</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-widest">Your Name</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Expires</p>
                <p className="mt-1 text-sm font-bold tracking-widest">MM/YY</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="col-span-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Cardholder Name</label>
              <input {...register('cardHolder')} className="w-full rounded-2xl border-gray-200 bg-gray-50 px-6 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="John Doe" />
              {errors.cardHolder && <p className="text-xs font-semibold text-red-500">{errors.cardHolder.message}</p>}
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Card Number</label>
              <div className="relative">
                <input {...register('cardNumber')} maxLength={16} className="w-full rounded-2xl border-gray-200 bg-gray-50 px-6 py-4 pl-12 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" placeholder="0000 0000 0000 0000" />
                <Lock className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.cardNumber && <p className="text-xs font-semibold text-red-500">{errors.cardNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Expiry Date</label>
              <input {...register('expiry')} placeholder="MM/YY" className="w-full rounded-2xl border-gray-200 bg-gray-50 px-6 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
              {errors.expiry && <p className="text-xs font-semibold text-red-500">{errors.expiry.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">CVV</label>
              <input {...register('cvv')} maxLength={3} placeholder="123" className="w-full rounded-2xl border-gray-200 bg-gray-50 px-6 py-4 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
              {errors.cvv && <p className="text-xs font-semibold text-red-500">{errors.cvv.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={orderMutation.isPending} className="group relative mt-12 w-full overflow-hidden rounded-[2rem] bg-blue-600 py-6 text-lg font-black text-white shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]">
            <div className="flex items-center justify-center gap-3">
              {orderMutation.isPending ? 'Processing Transaction...' : `Pay $${total.toFixed(2)} Now`}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </form>
      </div>

      <div className="lg:pl-12">
        <div className="sticky top-32 space-y-8 rounded-[2.5rem] border bg-gray-50/50 p-10">
          <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
          <div className="flex gap-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
              <img src={product?.imageUrl} alt={product?.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{product?.name}</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Quantity: {quantity}</p>
              <p className="mt-1 font-black text-blue-600">${product?.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-4 border-t pt-8">
            <div className="flex justify-between text-sm font-medium text-gray-500">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500">
              <span>Shipping</span>
              <span className="font-bold text-green-600 uppercase tracking-widest text-[10px]">Free</span>
            </div>
            <div className="flex justify-between pt-4 text-xl font-black text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-blue-50 px-6 py-4 text-blue-700">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-xs font-bold leading-relaxed">
              Your transaction is secured by AES-256 encryption. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
