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

export default api
