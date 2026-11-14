import React, { useState } from 'react';
import { loginApi } from '../services/api';

function LoginPage({ setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Interceptor đã trả về data, nên res = { token, username, role }
      const res = await loginApi({ username, password });

      localStorage.setItem('token', res.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ username: res.username, role: res.role })
      );

      alert('Đăng nhập thành công!');
      setCurrentPage('home');
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Logo tròn kiểu Facebook (thay text bằng icon hoặc ảnh Pacman nếu muốn) */}
        <div className="login-logo-wrapper">
          <div className="login-logo-circle">
            <span>P</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              id="login-username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="login-password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            className="btn-facebook-style"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="login-divider"></div>

        <button
          type="button"
          id="btn-register-open"
          className="btn-register-style"
          onClick={() => setCurrentPage('register')}
        >
          Tạo tài khoản mới
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

export default LoginPage;