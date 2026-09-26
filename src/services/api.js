import axios from 'axios'

const api = axios.create({
  baseURL: '/api', // sẽ được proxy tới backend Spring Boot khi dev
  headers: {
    'Content-Type': 'application/json',
  },
})

// Gắn JWT token nếu có (ví dụ dùng cho backend Pacman của bạn)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// 1. Phương thức HTTP POST cho Đăng nhập
export const loginApi = async (credentials) => {
  // Gửi request POST tới endpoint /auth/login (hoặc /login tùy backend)
  const response = await api.post('/auth/login', credentials)
  return response.data
}

// 2. Phương thức HTTP POST cho Đăng ký
export const registerApi = async (userData) => {
  // Gửi request POST tới endpoint /auth/register (hoặc /register tùy backend)
  const response = await api.post('/auth/register', userData)
  return response.data
}
export default api
