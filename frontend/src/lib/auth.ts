import Keycloak from 'keycloak-js'

let keycloak: Keycloak | null = null

export async function initAuth() {
  if (typeof window === 'undefined') return null
  if (keycloak) return keycloak

  const kcOptions = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecomm-realm',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ecomm-frontend',
  }

  console.log('Keycloak config:', kcOptions)

  try {
    keycloak = new Keycloak(kcOptions)

    console.log('Attempting Keycloak init...')
    
    // 5-second timeout for Keycloak init
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Keycloak Init Timeout')), 5000)
    )

    const initPromise = keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      enableLogging: true
    })

    const authenticated = await Promise.race([initPromise, timeout])
    
    console.log('Keycloak init result:', authenticated)
    return keycloak
  } catch (error) {
    console.error('Keycloak initialization error or timeout:', error)
    // We keep the keycloak instance but authenticated will be false
    return keycloak
  }
}

export const getAuth = () => keycloak
export const login = () => keycloak?.login()
export const logout = () => keycloak?.logout({ redirectUri: window.location.origin + '/products' })
export const isAuthenticated = () => !!keycloak?.authenticated
export const getToken = () => keycloak?.token

export const getUserRoles = () => {
    return keycloak?.realmAccess?.roles || []
}

export const hasRole = (role: string) => {
    return getUserRoles().includes(role)
}

export const getUserId = () => keycloak?.subject
export const getUserName = () => keycloak?.tokenParsed?.preferred_username || keycloak?.tokenParsed?.email
