import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { loginApi } from '../services/api';

function LoginPage({ setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { state } = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Interceptor đã trả về data, nên res = { token, username, role }
      const res = await loginApi({ username, password });

      localStorage.setItem('token', res.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ username: res.username, role: res.role })
      );

      setCurrentPage('game');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
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

        {state?.notice && <p className="form-feedback form-feedback--success" role="status">{state.notice}</p>}
        {error && <p id="login-error" className="form-feedback form-feedback--error" role="alert">{error}</p>}

        <form onSubmit={handleLogin} className="login-form" aria-describedby={error ? 'login-error' : undefined}>
          <div className="input-group">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              id="login-username"
              autoComplete="username"
              spellCheck="false"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              type="password"
              name="password"
              id="login-password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
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

        <Link
          id="btn-register-open"
          className="btn-register-style"
          to="/register"
        >
          Tạo tài khoản mới
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

export default LoginPage;
