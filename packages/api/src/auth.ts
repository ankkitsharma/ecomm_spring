import Keycloak from 'keycloak-js'

let keycloak: Keycloak | null = null

export async function initAuth() {
  if (typeof window === 'undefined') return null
  
  // Try to load from localStorage first
  const storedToken = localStorage.getItem('access_token')
  if (storedToken && !keycloak) {
      // Basic initialization to have the instance ready
      keycloak = new Keycloak({
        url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
        realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecomm-realm',
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ecomm-frontend',
      })
      // @ts-ignore - manually set token
      keycloak.token = storedToken
      // @ts-ignore
      keycloak.authenticated = true
  }

  if (keycloak) return keycloak

  const kcOptions = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'ecomm-realm',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'ecomm-frontend',
  }

  try {
    keycloak = new Keycloak(kcOptions)
    
    // Attempt silent check if possible
    await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
    })
    
    if (keycloak.token) {
        localStorage.setItem('access_token', keycloak.token)
    }

    return keycloak
  } catch (error) {
    console.error('Keycloak initialization error:', error)
    return null
  }
}

export const getAuth = () => keycloak
export const login = () => keycloak?.login()
export const logout = () => {
    localStorage.removeItem('access_token')
    keycloak?.logout({ redirectUri: window.location.origin })
}
export const isAuthenticated = () => !!localStorage.getItem('access_token')
export const getToken = () => localStorage.getItem('access_token')

export const getUserRoles = () => {
    const token = getToken()
    if (!token) return []
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.realm_access?.roles || []
    } catch (e) {
        return []
    }
}

export const hasRole = (role: string) => {
    return getUserRoles().includes(role)
}

export const getUserId = () => {
    const token = getToken()
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub
}

export const getUserName = () => {
    const token = getToken()
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.preferred_username || payload.email
}

export const setAuthData = (tokenResponse: any) => {
    localStorage.setItem('access_token', tokenResponse.access_token)
    if (tokenResponse.refresh_token) {
        localStorage.setItem('refresh_token', tokenResponse.refresh_token)
    }
    // Force reload or re-init if needed
}
