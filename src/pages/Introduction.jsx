import React from 'react';
import introArt from '../assets/intro-art.jpg';
function Introduction() {
  return (
    <div className="page intro-page">
      <div className="intro-left">
        <img 
          src={introArt} 
          alt="Introduction Illustration" 
          style={{
            maxWidth: '420px',
            width: '100%',
            borderRadius: '16px',
            border: '2px solid rgba(253, 203, 2, 0.4)',
            boxShadow: '0 0 25px rgba(253, 203, 2, 0.2)',
            objectFit: 'cover',
            marginBottom: '18px'
          }} 
        />
        <p className="image-caption">"Designed to capture modern sophistication with timeless allure."</p>
      </div>
      <div className="intro-right">
        <h1 className="page-heading">Introduction</h1>
        <p className="desc-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>
    </div>
  );
}

export default Introduction;