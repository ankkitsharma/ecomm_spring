import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as productsRoute } from './routes/products'
import { Route as protectedRoute } from './routes/protected'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  protectedRoute,
])
