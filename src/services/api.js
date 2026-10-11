import axios from 'axios'

// 1. Khởi tạo instance với Timeout và BaseURL linh hoạt từ Env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Dùng cho Vite (nếu dùng CRA thì dùng process.env.REACT_APP_API_BASE_URL)
  timeout: 10000, // 10 giây timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Request Interceptor: Tự động gắn Token vào Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 3. Response Interceptor: Xử lý dữ liệu trả về & Bắt lỗi tập trung
api.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data thay vì toàn bộ Axios Response Object
    return response.data
  },
  (error) => {
    // Xử lý khi Token hết hạn hoặc không hợp lệ (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user') // Xóa thêm thông tin user nếu có
      
      // Chuyển hướng về trang login nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Chuẩn hóa message lỗi trả về để Component dễ hiển thị
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Đã có lỗi xảy ra, vui lòng thử lại!'

    return Promise.reject(new Error(errorMessage))
  }
)

// 4. Các hàm gọi API (nhờ Response Interceptor)
export const loginApi = (credentials) => api.post('/auth/login', credentials)

export const registerApi = (userData) => api.post('/auth/register', userData)

export default api