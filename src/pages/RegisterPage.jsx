import React, { useState } from 'react';

function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    // Chỗ để Ngọc Quyền gắn API Register
    console.log('Dữ liệu đăng ký:', formData);
  };

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
          <div className="input-group">
            <input
              type="text"
              name="username"
              id="register-username"
              placeholder="Tên tài khoản / Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              id="register-password"
              placeholder="Mật khẩu mới"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              id="register-confirm-password"
              placeholder="Xác nhận lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" id="btn-register-submit" className="btn-facebook-style">
            Đăng ký
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