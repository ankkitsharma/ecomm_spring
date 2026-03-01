import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { initAuth, isAuthenticated, login, logout } from '../lib/auth'
import api from '../lib/api'

export const Route = createFileRoute('/protected')({
  component: Protected,
})

function Protected() {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    initAuth().then(() => setAuthReady(true))
  }, [])

  const { data: userInfo, isLoading, error } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const res = await api.get('/api/protected/me')
      return res.data
    },
    enabled: authReady && isAuthenticated(),
  })

  if (!authReady) return <div>Initializing Auth...</div>

  if (!isAuthenticated()) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="mb-6">You need to be logged in to view this page.</p>
        <button 
          onClick={() => login()}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Login with Keycloak
        </button>
      </div>
    )
  }

  if (isLoading) return <div>Fetching user info...</div>
  if (error) return <div>Error fetching protected info.</div>

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Protected Profile</h1>
        <button 
          onClick={() => logout()}
          className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 shadow rounded border">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Backend Claims</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  )
}
