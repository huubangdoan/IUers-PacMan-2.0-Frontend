import { useRef, useState } from 'react';
import Navbar from './components/Navbar';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import GamePage from './pages/GamePage';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Stack from './utils/Stack';
function App() {
  // Biến lưu trang hiện tại, mặc định mở web là vào trang 'home'
  const [currentPage, setCurrentPage] = useState('home');

   // Stack lưu lịch sử các trang đã đi qua
  const historyRef = useRef(new Stack());

  // Chuyển sang trang mới: cất trang hiện tại vào stack rồi mới đổi
  const navigate = (page) => {
    if (page === currentPage) return;
    historyRef.current.push(currentPage);
    setCurrentPage(page);
  };

  // Quay lại: lấy trang ở đỉnh stack ra và hiển thị
  const goBack = () => {
    const previous = historyRef.current.pop();
    if (previous !== null) setCurrentPage(previous);
  };

  return (
    <div className="app-container">
      {/* Thanh menu luôn đứng trên cùng */}
      <Navbar setCurrentPage={setCurrentPage}
       onBack={goBack}
        canGoBack={!historyRef.current.isEmpty()} />

      {/* Bấm menu nào thì hiển thị trang đó */}
      <main className="content-container">
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <AboutUs setCurrentPage={setCurrentPage} />}
        {currentPage === 'contact' && <ContactUs setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'register' && <RegisterPage setCurrentPage={setCurrentPage} />}
      </main>
      {currentPage === 'game' && <GamePage />}
    </div>
  );
}

export default App;