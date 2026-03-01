import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchMyOrders } from '../../lib/api'
import { Package, Clock, CheckCircle2, Truck, CreditCard, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/buyer/')({
  component: BuyerDashboard,
})

function BuyerDashboard() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['buyer-orders'],
    queryFn: fetchMyOrders,
  })

  if (isLoading) return <div className="animate-pulse py-12 text-center text-gray-400">Retrieving your orders...</div>

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900">Your Orders</h1>
        <p className="mt-2 text-gray-500">Track shipments and view order history</p>
      </div>

      <div className="space-y-6">
        {orders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-200 py-20">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-400">
              <Package className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="mt-2 text-gray-500">When you buy products, they will appear here.</p>
          </div>
        ) : (
          orders?.map((order: any) => (
            <div key={order.id} className="group overflow-hidden rounded-[2rem] border bg-white transition-all hover:shadow-xl hover:shadow-blue-100/50">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-gray-50/50 px-8 py-6">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</span>
                    <p className="text-sm font-bold text-gray-900">#ORD-{order.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Placed On</span>
                    <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</span>
                    <p className="text-sm font-black text-blue-600">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status === 'PAID' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {order.status}
                  </span>
                  <button className="rounded-full p-2 text-gray-300 transition-colors group-hover:bg-gray-100 group-hover:text-gray-900">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="divide-y px-8">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 font-black text-blue-600">
                        {item.quantity}x
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.productName}</h4>
                        <p className="text-sm font-medium text-gray-500">Unit Price: ${item.priceAtPurchase.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">${(item.quantity * item.priceAtPurchase).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
