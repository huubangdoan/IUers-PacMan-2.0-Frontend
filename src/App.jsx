import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Introduction from './pages/Introduction';
import Features from './pages/Features';
import ContactUs from './pages/ContactUs';

function App() {
  // Biến lưu trang hiện tại, mặc định mở web là vào trang 'home'
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="app-container">
      {/* Thanh menu luôn đứng trên cùng */}
      <Navbar setCurrentPage={setCurrentPage} />

      {/* Bấm menu nào thì hiển thị trang đó */}
      <main className="content-container">
        {currentPage === 'home' && <Home />}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'intro' && <Introduction />}
        {currentPage === 'features' && <Features />}
        {currentPage === 'contact' && <ContactUs />}
      </main>
    </div>
  );
}

export default App;