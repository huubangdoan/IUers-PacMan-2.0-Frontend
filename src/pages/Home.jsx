import React from 'react';
import homeArt from '../assets/home-art.jpg';
import Introduction from './Introduction';
import Features from './Features';

function Home() {
  return (
    <div className="home-container">
    <div className="page home-page">
      <div className="home-left">
        <h1 className="main-title">IUers' Pacman</h1>
        <p className="sub-title">Giới thiệu game ngắn gọn</p>
        <button className="btn-play-now">PLAY NOW</button>
      </div>

      <div className="home-right">
        <img 
          src={homeArt} 
          alt="IUers Pacman" 
          style={{
            maxWidth: '480px',
            width: '100%',
            borderRadius: '16px',
            border: '2px solid rgba(253, 203, 2, 0.4)',
            boxShadow: '0 0 25px rgba(253, 203, 2, 0.2)',
            objectFit: 'cover'
          }}/>
      </div>
    </div>

      <div id="introduction" className="home-section">
        <Introduction />
      </div>

      <div id="features" className="home-section">
        <Features />
      </div>
    </div>
  );
}

export default Home;