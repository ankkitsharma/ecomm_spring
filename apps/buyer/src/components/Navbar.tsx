import { Link } from "@tanstack/react-router"
import { isAuthenticated, logout, hasRole, getUserName } from "@ecomm/api"
import { User, LogOut, LayoutDashboard, ShoppingBag, UserPlus, LogIn, ShoppingCart } from "lucide-react"
import { useCart } from "../lib/CartContext"

export function Navbar() {
  const authenticated = isAuthenticated()
  const username = getUserName()
  const { totalItems } = useCart()

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
              <a href="http://localhost:3001" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 transition-colors hover:text-blue-600">
                <LayoutDashboard className="h-4 w-4" />
                Seller Dashboard
              </a>
            )}
            {hasRole("ADMIN") && (
              <a href="http://localhost:3002" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 transition-colors hover:text-blue-600">
                <User className="h-4 w-4" />
                Admin Panel
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
                <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in">
                        {totalItems}
                    </span>
                )}
            </div>

            {authenticated ? (
                <>
                <Link to="/buyer" className="text-gray-600 transition-colors hover:text-blue-600" title="Order History">
                    <ShoppingBag className="h-6 w-6" />
                </Link>
                
                <div className="flex items-center gap-3 border-l pl-6">
                    <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Welcome</span>
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
                </>
            ) : (
                <div className="flex items-center gap-3 border-l pl-6">
                <Link 
                    to="/register"
                    className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-100"
                >
                    <UserPlus className="h-4 w-4" />
                    Register
                </Link>
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
                >
                    <LogIn className="h-4 w-4" />
                    Sign In
                </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
