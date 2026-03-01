import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { isAuthenticated, hasRole } from '../lib/auth'

export const Route = createFileRoute('/')({
  component: RedirectHome,
})

function RedirectHome() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: '/products', replace: true })
    } else if (hasRole('ADMIN')) {
      navigate({ to: '/admin', replace: true })
    } else if (hasRole('SELLER')) {
      navigate({ to: '/seller', replace: true })
    } else {
      navigate({ to: '/products', replace: true })
    }
  }, [navigate])

  return null
}
