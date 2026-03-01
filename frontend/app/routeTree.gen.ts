// This is a placeholder for TanStack Router's routeTree generation.
// In a real project, this is automatically updated when running the dev server.
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'

export const routeTree = rootRoute.addChildren([
  indexRoute,
])
