import { createFileRoute } from '@tanstack/react-router'
import { Users, BarChart3, ShieldAlert, Activity, ArrowUpRight, DollarSign } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900">Platform Overview</h1>
        <p className="mt-2 text-gray-500">Global system administration and performance tracking</p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: DollarSign, color: 'text-green-600 bg-green-50' },
          { label: 'Active Sellers', value: '1,240', change: '+4.2%', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Orders', value: '45,210', change: '+18.1%', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
          { label: 'System Health', value: '99.9%', change: 'Stable', icon: Activity, color: 'text-amber-600 bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="rounded-[2rem] border bg-white p-8 transition-all hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className={`rounded-2xl p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-black text-green-600">
                {stat.change}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              <h3 className="mt-1 text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border bg-white p-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Security Alerts</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="mt-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b pb-6 last:border-0 last:pb-0">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Suspicious Login Attempt</h4>
                  <p className="text-sm font-medium text-gray-500">IP 192.168.1.{i * 10} flagged in Frankfurt, DE</p>
                </div>
                <span className="ml-auto text-[10px] font-bold text-gray-400">2h ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border bg-gray-900 p-10 text-white">
          <h2 className="text-xl font-black">System Maintenance</h2>
          <p className="mt-4 font-medium text-gray-400">
            Upcoming database optimization scheduled for Sunday at 02:00 UTC. 
            Expected downtime: 15 minutes.
          </p>
          <div className="mt-8 rounded-2xl bg-white/5 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold">Resource Allocation</span>
              <span className="text-blue-400 font-black">74%</span>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-gray-800 overflow-hidden">
              <div className="h-full w-[74%] bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <button className="mt-10 w-full rounded-2xl bg-white py-4 text-sm font-black text-gray-900 transition-transform active:scale-95">
            Optimize Now
          </button>
        </div>
      </div>
    </div>
  )
}
