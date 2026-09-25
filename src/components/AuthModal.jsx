import React from 'react';

function AuthModal() {
  return (
    <div className="auth-box">
      <h3>ĐĂNG NHẬP / ĐĂNG KÝ</h3>
      <div className="auth-inputs">
        <input type="text" id="username" placeholder="Tên đăng nhập" />
        <input type="password" id="password" placeholder="Mật khẩu" />
      </div>
      <div className="auth-actions">
        <button id="btn-login">Đăng Nhập</button>
        <button id="btn-register">Đăng Ký</button>
      </div>
    </div>
  );
}

export default AuthModal;