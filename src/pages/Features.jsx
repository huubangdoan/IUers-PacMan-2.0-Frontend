import React from 'react';

function Features() {
  return (
    <div className="page feature-page">
      <div className="feature-left">
        <h1 className="page-heading">What feature ?</h1>
        <p className="desc-text">Mô tả các tính năng chính của game Pac-Man và các thuật toán DSA...</p>
      </div>
      <div className="feature-gallery">
        <div className="gallery-item large">Ảnh dọc to</div>
        <div className="gallery-col">
          <div className="gallery-item">Ảnh nhỏ 1</div>
          <div className="gallery-item">Ảnh nhỏ 2</div>
        </div>
        <div className="gallery-col">
          <div className="gallery-item">Ảnh nhỏ 3</div>
          <div className="gallery-item">Ảnh nhỏ 4</div>
        </div>
      </div>
    </div>
  );
}

export default Features;