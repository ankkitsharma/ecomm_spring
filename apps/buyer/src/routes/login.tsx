import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { loginUser, setAuthData } from '@ecomm/api'
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginData = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await loginUser(data)
      setAuthData(response)
      window.location.href = '/' // Force reload to re-init auth state
    } catch (err: any) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg py-20">
      <div className="relative overflow-hidden rounded-[3rem] border bg-white p-12 shadow-2xl shadow-blue-100/50">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-50/50 blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 font-medium text-gray-500">Sign in to your premium account</p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-4 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 mt-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <input {...register('email')} className="input-premium pl-12" placeholder="name@example.com" />
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

          <button 
            type="submit" 
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-3 rounded-[2rem] bg-gray-900 py-6 text-lg font-black text-white shadow-2xl transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="relative z-10 mt-10 text-center">
          <p className="text-sm font-medium text-gray-500">
            Don't have an account? {' '}
            <button onClick={() => navigate({ to: '/register' })} className="font-black text-blue-600 hover:underline">
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
