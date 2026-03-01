import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { initAuth, isAuthenticated, login, logout } from "../lib/auth"
import api from "../lib/api"

export const Route = createFileRoute("/protected")({
  component: Protected,
})

function Protected() {
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    initAuth().then(() => setAuthReady(true))
  }, [])

  const {
    data: userInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const res = await api.get("/api/protected/me")
      return res.data
    },
    enabled: authReady && isAuthenticated(),
  })

  if (!authReady) return <div>Initializing Auth...</div>

  if (!isAuthenticated()) {
    return (
      <div className="py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mb-6">You need to be logged in to view this page.</p>
        <button
          onClick={() => login()}
          className="rounded bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Protected Profile</h1>
        <button
          onClick={() => logout()}
          className="rounded bg-gray-600 px-4 py-1 text-white hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
      <div className="rounded border bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-blue-600">Backend Claims</h2>
        <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-4">
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  )
}
