import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerApi } from '../services/api';

function RegisterPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      // Backend chỉ cần username và password
      await registerApi({
        username: formData.username,
        password: formData.password
      });
      setCurrentPage('login', { state: { notice: 'Đăng ký thành công. Hãy đăng nhập.' } });
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Gộp 3 ô input giống nhau thành 1 hàm dùng chung
  const renderInput = (name, type, label, autoComplete) => (
    <div className="input-group">
      <label htmlFor={`register-${name}`}>{label}</label>
      <input
        type={type}
        name={name}
        id={`register-${name}`}
        autoComplete={autoComplete}
        placeholder={`Nhập ${label.toLowerCase()}`}
        value={formData[name]}
        onChange={(event) => {
          handleChange(event);
          setError('');
        }}
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
        {error && <p id="register-error" className="form-feedback form-feedback--error" role="alert">{error}</p>}

        <form onSubmit={handleRegister} className="login-form" aria-describedby={error ? 'register-error' : undefined}>
          {renderInput('username', 'text', 'Tên đăng nhập', 'username')}
          {renderInput('password', 'password', 'Mật khẩu', 'new-password')}
          {renderInput('confirmPassword', 'password', 'Xác nhận mật khẩu', 'new-password')}

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
        <Link
          className="btn-register-style"
          to="/login"
        >
          Bạn đã có tài khoản?
        </Link>

        {/* Nút quay lại trang chủ */}
        <div className="login-footer">
          <Link
            className="btn-back-home"
            to="/"
          >
            ← Quay lại Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
