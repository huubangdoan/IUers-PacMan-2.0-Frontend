import React from 'react';

function Home() {
  return (
    <div className="page home-page">
      <div className="home-left">
        <h1 className="main-title">IUers' Pacman</h1>
        <p className="sub-title">Giới thiệu game ngắn gọn</p>
        <button className="btn-play-now">PLAY NOW</button>
      </div>

      <div className="home-right">
        <div className="image-placeholder">Khung ảnh Game</div>
      </div>
    </div>
  );
}

export default Home;