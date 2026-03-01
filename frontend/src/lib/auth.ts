import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'ecomm-realm',
  clientId: 'ecomm-frontend',
})

let isInitialized = false

export async function initAuth() {
  if (isInitialized) return keycloak
  
  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    isInitialized = true
    return keycloak
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error)
    return null
  }
}

export const getAuth = () => keycloak
export const login = () => keycloak.login()
export const logout = () => keycloak.logout()
export const isAuthenticated = () => keycloak.authenticated
export const getToken = () => keycloak.token
