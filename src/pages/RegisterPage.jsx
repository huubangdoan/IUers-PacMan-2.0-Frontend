import React, { useState } from 'react';
import { registerApi } from '../services/api';

function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      // Backend chỉ cần username và password
      await registerApi({
        username: formData.username,
        password: formData.password
      });
      alert('Đăng ký thành công! Hãy đăng nhập.');
      setCurrentPage('login');
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gộp 3 ô input giống nhau thành 1 hàm dùng chung
  const renderInput = (name, type, placeholder) => (
    <div className="input-group">
      <input
        type={type}
        name={name}
        id={`register-${name}`}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Logo tròn Pac-Man */}
        <div className="login-logo-wrapper">
          <div className="login-logo-circle">
            <span>P</span>
          </div>
        </div>

        <h2 style={{ color: '#FDCB02', margin: '0 0 20px 0', fontSize: '1.5rem', textAlign: 'center' }}>
          Tạo tài khoản mới
        </h2>

        {/* Form đăng ký */}
        <form onSubmit={handleRegister} className="login-form">
          {renderInput('username', 'text', 'Tên tài khoản / Username')}
          {renderInput('password', 'password', 'Mật khẩu mới')}
          {renderInput('confirmPassword', 'password', 'Xác nhận lại mật khẩu')}

          <button
            type="submit"
            id="btn-register-submit"
            className="btn-facebook-style"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="login-divider"></div>

        {/* Nút quay lại trang Đăng nhập */}
        <button
          type="button"
          className="btn-register-style"
          onClick={() => setCurrentPage('login')}
        >
          Bạn đã có tài khoản?
        </button>

        {/* Nút quay lại trang chủ */}
        <div className="login-footer">
          <button
            type="button"
            className="btn-back-home"
            onClick={() => setCurrentPage('home')}
          >
            ← Quay lại Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;