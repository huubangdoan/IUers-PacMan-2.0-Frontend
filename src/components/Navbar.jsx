import React from 'react';

function Navbar({ setCurrentPage }) {
  return (
    <header className="navbar">
      <div className="nav-logo">DSA Project</div>
      <nav className="nav-links">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('about')}>About Us</button>
        <button onClick={() => setCurrentPage('intro')}>Introduction</button>
        <button onClick={() => setCurrentPage('features')}>Features</button>
        <button onClick={() => setCurrentPage('contact')}>Contact Us</button>
      </nav>
      <div className="nav-auth">
        <button id="nav-btn-auth">Đăng Nhập</button>
      </div>
    </header>
  );
}

export default Navbar;