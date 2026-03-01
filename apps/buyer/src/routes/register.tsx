import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { registerUser, loginUser, setAuthData } from '@ecomm/api'
import { User, ShieldCheck, ShoppingBag, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum(['BUYER', 'SELLER'], {
    required_error: 'Please select a role',
  }),
})

type RegisterData = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'BUYER'
    }
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)
    try {
      await registerUser(data)
      // Auto login after registration
      const tokenRes = await loginUser({ email: data.email, password: data.password })
      setAuthData(tokenRes)
      window.location.href = '/'
    } catch (err: any) {
      setError('Registration failed. This email might already be in use.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <div className="rounded-[3rem] border bg-white p-12 shadow-2xl shadow-blue-100/50">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200">
            <User className="h-8 w-8" />
          </div>
          <h1 className="mt-8 text-3xl font-black tracking-tight text-gray-900">Create Account</h1>
          <p className="mt-2 font-medium text-gray-500">Join our premium commerce ecosystem</p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">First Name</label>
              <input {...register('firstName')} className="input-premium" placeholder="John" />
              {errors.firstName && <p className="text-xs font-bold text-red-500 ml-4">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Last Name</label>
              <input {...register('lastName')} className="input-premium" placeholder="Doe" />
              {errors.lastName && <p className="text-xs font-bold text-red-500 ml-4">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <input {...register('email')} className="input-premium pl-12" placeholder="john@example.com" />
              <Mail className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && <p className="text-xs font-bold text-red-500 ml-4">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <input type="password" {...register('password')} className="input-premium pl-12" placeholder="••••••••" />
              <Lock className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.password && <p className="text-xs font-bold text-red-500 ml-4">{errors.password.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">I want to...</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all ${selectedRole === 'BUYER' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" {...register('role')} value="BUYER" className="sr-only" />
                <ShoppingBag className={`h-6 w-6 ${selectedRole === 'BUYER' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="mt-4 font-black text-gray-900">Buy Products</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-tight text-gray-400 leading-tight">I'm looking for premium tech</span>
              </label>
              <label className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all ${selectedRole === 'SELLER' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" {...register('role')} value="SELLER" className="sr-only" />
                <ShieldCheck className={`h-6 w-6 ${selectedRole === 'SELLER' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="mt-4 font-black text-gray-900">Sell Products</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-tight text-gray-400 leading-tight">I want to list my inventory</span>
              </label>
            </div>
            {errors.role && <p className="text-xs font-bold text-red-500 ml-4">{errors.role.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-[2rem] bg-gray-900 py-6 text-lg font-black text-white shadow-2xl transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                Register Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-gray-500">
            Already have an account? {' '}
            <button onClick={() => navigate({ to: '/login' })} className="font-black text-blue-600 hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
