import React, { useState } from 'react';
import pacman from '../assets/Default Skin/right/1.webp';
import blinky from '../assets/Default Skin/ghosts/blinky.webp';
import pinky from '../assets/Default Skin/ghosts/pinky.webp';
import inky from '../assets/Default Skin/ghosts/inky.webp';
import clyde from '../assets/Default Skin/ghosts/clyde.webp';
import './GameMenu.css';

/** UI-only menu. The gameplay integration will be handled by the game team. */
export default function GameMenu({ setCurrentPage }) {
  const [panel, setPanel] = useState('menu');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  return (
    <section className="game-menu-page" aria-labelledby="game-menu-title">
      <div className="game-menu-card">
        <div className="game-menu-eyebrow">WELCOME TO THE MULTIVERSE</div>
        <h1 id="game-menu-title" className="game-menu-title">IUers' <span>Pac-Man</span></h1>
        <div className="game-menu-characters" aria-hidden="true">
          {[pacman, blinky, pinky, inky, clyde].map((img, index) => (
            <img key={index} src={img} alt="" />
          ))}
        </div>

        {panel === 'menu' && (
          <div className="game-menu-actions">
            <button className="game-menu-primary" onClick={() => setPanel('coming-soon')}>START GAME</button>
            <button onClick={() => setPanel('instructions')}>HOW TO PLAY</button>
            <button onClick={() => setCurrentPage('home')}>BACK TO HOME</button>
          </div>
        )}

        {panel === 'instructions' && (
          <div className="game-menu-panel">
            <h2>HOW TO PLAY</h2>
            <p>Use the arrow keys to move Pac-Man, collect dots, and avoid ghosts.</p>
            <p>These are introductory instructions; final controls and rules will be updated when gameplay is integrated.</p>
            <button onClick={() => setPanel('menu')}>BACK TO MENU</button>
          </div>
        )}

        {panel === 'coming-soon' && (
          <div className="game-menu-panel" role="status">
            <h2>GAMEPLAY IN PROGRESS</h2>
            <p>The game menu is ready. The gameplay screen will be connected when the game engine is available.</p>
            <button onClick={() => setPanel('menu')}>BACK TO MENU</button>
          </div>
        )}

        <button className="game-menu-signout" onClick={handleLogout}>LOG OUT</button>
      </div>
    </section>
  );
}
