import { useState } from 'react';
import { loginApi, registerApi } from '../services/api';
function AuthModal() {
  // Quản lý state cho username và password
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Xử lý sự kiện bấm nút Đăng Nhập
  const handleLogin = async () => {
    // kiểm tra rỗng
    if (!formData.username || !formData.password) {
      alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }
    try {
      // Gọi hàm HTTP POST loginApi từ api.js để gửi dữ liệu đăng nhập
      const data = await loginApi(formData);
      // Nếu Backend trả về token xác thực, lưu token vào bộ nhớ trình duyệt
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      alert('Đăng nhập thành công!');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  // Xử lý sự kiện bấm nút Đăng Ký
  const handleRegister = async () => {
    if (!formData.username || !formData.password) {
      alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }
    try {
      // Gọi hàm HTTP POST registerApi từ api.js để gửi dữ liệu đăng ký
      await registerApi(formData);
      alert('Đăng ký thành công! Hãy bấm Đăng Nhập.');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert(error.response?.data?.message || 'Đăng ký thất bại!');
    }
  };
  return (
    <div className="auth-box">
      <h3>ĐĂNG NHẬP / ĐĂNG KÝ</h3>
      <div className="auth-inputs">
        <input type="text" id="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} />

        <input type="password" id="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} />
      </div>
      <div className="auth-actions">
        <button id="btn-login" onClick={handleLogin}>Đăng Nhập</button>
        <button id="btn-register" onClick={handleRegister}>Đăng Ký</button>
      </div>
    </div>
  );
}

export default AuthModal;