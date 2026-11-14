import { useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import GamePage from './pages/GamePage';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Stack from './utils/Stack';

const PAGE_BY_PATH = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
  '/login': 'login',
  '/register': 'register',
  '/game': 'game',
};

const PATH_BY_PAGE = Object.fromEntries(
  Object.entries(PAGE_BY_PATH).map(([path, page]) => [page, path]),
);

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPage = PAGE_BY_PATH[pathname] ?? 'home';

  const historyRef = useRef(new Stack());
  const recordNavigation = (page) => {
    if (page !== currentPage) historyRef.current.push(currentPage);
  };
  const setCurrentPage = (page, options) => {
    if (page === currentPage) return;
    historyRef.current.push(currentPage);
    navigate(PATH_BY_PAGE[page] ?? '/', options);
  };

  const goBack = () => {
    while (!historyRef.current.isEmpty()) {
      const previous = historyRef.current.pop();
      if (previous === 'home') {
        navigate('/', { replace: true });
        return;
      }
    }
    navigate('/', { replace: true });
  };

  return (
    <div className={`app-container${currentPage === 'game' ? ' app-container--game' : ''}`}>
      {currentPage !== 'game' && <Navbar onNavigate={recordNavigation} />}

      <main id="main-content" className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs setCurrentPage={setCurrentPage} />} />
          <Route path="/contact" element={<ContactUs setCurrentPage={setCurrentPage} />} />
          <Route path="/login" element={<LoginPage setCurrentPage={setCurrentPage} />} />
          <Route path="/register" element={<RegisterPage setCurrentPage={setCurrentPage} />} />
          <Route
            path="/game"
            element={localStorage.getItem('token')
              ? <GamePage onBack={goBack} />
              : <Navigate to="/login" replace state={{ notice: 'Đăng nhập để vào game.' }} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
