import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

api.interceptors.request.use(async (config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

// Typed API helpers
export const fetchProducts = () => api.get('/api/products').then(res => res.data)
export const fetchProduct = (id: string | number) => api.get(`/api/products/${id}`).then(res => res.data)
export const fetchCategories = () => api.get('/api/categories').then(res => res.data)

// Seller API
export const fetchMyProducts = () => api.get('/api/seller/products').then(res => res.data)
export const createProduct = (data: any) => api.post('/api/seller/products', data).then(res => res.data)
export const updateProduct = (id: number, data: any) => api.put(`/api/seller/products/${id}`, data).then(res => res.data)
export const deleteProduct = (id: number) => api.delete(`/api/seller/products/${id}`).then(res => res.data)

// Buyer API
export const fetchMyOrders = () => api.get('/api/buyer/orders').then(res => res.data)
export const placeOrder = (data: any) => api.post('/api/buyer/orders', data).then(res => res.data)
