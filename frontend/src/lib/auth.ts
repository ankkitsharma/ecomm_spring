import Keycloak from 'keycloak-js'

let keycloak: Keycloak | null = null

export async function initAuth() {
  if (typeof window === 'undefined') return null
  if (keycloak) return keycloak

  keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  })

  try {
    await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    return keycloak
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error)
    return null
  }
}

export const getAuth = () => keycloak
export const login = () => keycloak?.login()
export const logout = () => keycloak?.logout()
export const isAuthenticated = () => !!keycloak?.authenticated
export const getToken = () => keycloak?.token
