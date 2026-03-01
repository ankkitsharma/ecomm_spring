import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchAllUsers, fetchAllProducts } from '@ecomm/api'
import { Users, DollarSign, Activity, Package, Mail, Calendar, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAllUsers,
  })

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchAllProducts,
  })

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Platform Intelligence</h1>
        <p className="mt-2 text-gray-500 font-medium text-lg">Global system tracking and strategic administration</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Platform Users', value: users?.length || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Inventory', value: products?.length || 0, icon: Package, color: 'text-purple-600 bg-purple-50' },
          { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-green-600 bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="rounded-[2rem] border bg-white p-10 transition-all hover:shadow-2xl hover:shadow-blue-100/50">
            <div className={`inline-flex rounded-2xl p-4 ${stat.color}`}>
              <stat.icon className="h-8 w-8" />
            </div>
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              <h3 className="mt-2 text-4xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* User Management List */}
        <div className="rounded-[3rem] border bg-white p-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-gray-900">Recent Users</h2>
            <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {usersLoading ? <div className="animate-pulse h-40 bg-gray-100 rounded-3xl"></div> : 
              users?.slice(0, 5).map((user: any) => (
                <div key={user.id} className="group flex items-center gap-4 rounded-2xl border border-transparent p-2 transition-all hover:border-gray-100 hover:bg-gray-50">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400">
                    {user.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{user.firstName} {user.lastName}</h4>
                    <p className="text-xs font-medium text-gray-400">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Active</span>
                    <span className="text-[10px] font-bold text-gray-300">{new Date(user.createdTimestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Global Inventory Preview */}
        <div className="rounded-[3rem] border bg-gray-900 p-12 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black">Platform Inventory</h2>
            <Package className="h-6 w-6 text-gray-600" />
          </div>
          <div className="space-y-6">
            {productsLoading ? <div className="animate-pulse h-40 bg-white/5 rounded-3xl"></div> :
              products?.slice(0, 5).map((product: any) => (
                <div key={product.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={product.imageUrl} className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-sm">{product.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{product.categoryName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm">${product.price.toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-gray-500">{product.stockQuantity} in stock</p>
                  </div>
                </div>
              ))
            }
          </div>
          <button className="mt-10 w-full rounded-2xl bg-white py-4 text-sm font-black text-gray-900 transition-transform active:scale-95">
            Inventory Report
          </button>
        </div>
      </div>
    </div>
  )
}
