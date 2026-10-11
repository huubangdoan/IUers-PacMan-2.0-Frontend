import React from 'react';

function Navbar({ setCurrentPage }) {
  return (
    <header className="navbar">
      <div className="nav-logo">DSA Project</div>
      <nav className="nav-links">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('about')}>About Us</button>
        <button onClick={() => setCurrentPage('contact')}>Contact Us</button>
        <button onClick={() => setCurrentPage('login')}>Đăng Nhập</button>
      </nav>
    </header>
  );
}

export default Navbar;