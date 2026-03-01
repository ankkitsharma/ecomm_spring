import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ProductsIndexRouteImport } from './routes/products.index'
import { Route as ProductDetailsRouteImport } from './routes/products.$productId'
import { Route as RegisterRouteImport } from './routes/register'
import { Route as LoginRouteImport } from './routes/login'
import { Route as CheckoutRouteImport } from './routes/checkout'
import { Route as ProtectedRouteImport } from './routes/protected'
import { Route as BuyerIndexRouteImport } from './routes/buyer/index'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

const ProductsIndexRoute = ProductsIndexRouteImport.update({
  id: '/products/',
  path: '/products/',
  getParentRoute: () => rootRouteImport,
} as any)

const ProductDetailsRoute = ProductDetailsRouteImport.update({
  id: '/products/$productId',
  path: '/products/$productId',
  getParentRoute: () => rootRouteImport,
} as any)

const RegisterRoute = RegisterRouteImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRouteImport,
} as any)

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)

const CheckoutRoute = CheckoutRouteImport.update({
  id: '/checkout',
  path: '/checkout',
  getParentRoute: () => rootRouteImport,
} as any)

const ProtectedRoute = ProtectedRouteImport.update({
  id: '/protected',
  path: '/protected',
  getParentRoute: () => rootRouteImport,
} as any)

const BuyerIndexRoute = BuyerIndexRouteImport.update({
  id: '/buyer/',
  path: '/buyer/',
  getParentRoute: () => rootRouteImport,
} as any)

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/products/': {
      id: '/products/'
      path: '/products'
      fullPath: '/products'
      preLoaderRoute: typeof ProductsIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/products/$productId': {
      id: '/products/$productId'
      path: '/products/$productId'
      fullPath: '/products/$productId'
      preLoaderRoute: typeof ProductDetailsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/checkout': {
      id: '/checkout'
      path: '/checkout'
      fullPath: '/checkout'
      preLoaderRoute: typeof CheckoutRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/protected': {
      id: '/protected'
      path: '/protected'
      fullPath: '/protected'
      preLoaderRoute: typeof ProtectedRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/buyer/': {
      id: '/buyer/'
      path: '/buyer'
      fullPath: '/buyer'
      preLoaderRoute: typeof BuyerIndexRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

export const routeTree = rootRouteImport._addFileChildren({
  IndexRoute,
  ProductsIndexRoute,
  ProductDetailsRoute,
  RegisterRoute,
  LoginRoute,
  CheckoutRoute,
  ProtectedRoute,
  BuyerIndexRoute,
})
