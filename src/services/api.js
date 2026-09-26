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
/**
 * HTTP Method POST: Gửi yêu cầu Đăng ký (Register)
 * @param {Object} userData - Chứa { username, password, ... }
 */
export const registerUser = async (userData) => {
  try {
    // Gọi API POST /api/auth/register (hoặc endpoint tương ứng từ Backend)
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error)
    throw error
  }
}

/**
 * HTTP Method POST: Gửi yêu cầu Đăng nhập (Login)
 * @param {Object} credentials - Chứa { username, password }
 */
export const loginUser = async (credentials) => {
  try {
    // Gọi API POST /api/auth/login
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error)
    throw error
  }
}

export default api
