import React, { useState } from 'react';

function LoginPage({ setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Đây là chỗ để Quyền gắn hàm gọi API Login
    console.log('Đăng nhập với:', { username, password });
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

          <button type="submit" id="btn-login-submit" className="btn-facebook-style">
            Đăng nhập
          </button>
        </form>
{/* --- ĐOẠN NÀY DƯỚI THẺ </form> --- */}
        <div className="login-divider"></div>

        <button 
          type="button" 
          id="btn-register-open" 
          className="btn-register-style"
          onClick={() => console.log('Bấm đăng ký')}
        >
          Tạo tài khoản mới
        </button>
        {/* ------------------------------------- */}
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