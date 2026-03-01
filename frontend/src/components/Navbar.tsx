import { Link } from "@tanstack/react-router"
import { isAuthenticated, login, logout, hasRole, getUserName } from "../lib/auth"
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, ShoppingBag, UserPlus } from "lucide-react"

export function Navbar() {
  const authenticated = isAuthenticated()
  const username = getUserName()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2 text-2xl font-black tracking-tight text-blue-600 transition-colors hover:text-blue-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-transform group-hover:scale-105">
              E
            </div>
            <span>ESTORE</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link to="/products" className="text-sm font-bold text-gray-600 transition-colors hover:text-blue-600">
              Browse Products
            </Link>
            {hasRole("SELLER") && (
              <Link to="/seller" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 transition-colors hover:text-blue-600">
                <LayoutDashboard className="h-4 w-4" />
                Seller Dashboard
              </Link>
            )}
            {hasRole("ADMIN") && (
              <Link to="/admin" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 transition-colors hover:text-blue-600">
                <User className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/buyer" className="relative text-gray-600 transition-colors hover:text-blue-600">
                <ShoppingBag className="h-6 w-6" />
                <span className="sr-only">Orders</span>
              </Link>
              
              <div className="flex items-center gap-3 border-l pl-6">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400 leading-none mb-1">Authenticated</span>
                  <span className="text-sm font-black text-gray-900 leading-none">{username}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/register"
                className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-100"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Link>
              <button
                onClick={() => login()}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
