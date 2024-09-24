import React from 'react';
import './Footer.css'; // Add styles for the footer if needed

const Footer = ({ onPlayPause, onBackward, onForward, isPlaying, progress, onSeek }) => {
  const handleProgressBarClick = (event) => {
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const newProgress = (clickPosition / progressBar.clientWidth) * 100;
    onSeek(newProgress);
  };

  return (
    <footer className="footer fixed-bottom">
      <div className="footer-content d-flex flex-column align-items-center p-3 bg-dark text-white">
        <div className="controls d-flex justify-content-between align-items-center mb-2">
          <button onClick={onBackward} className="btn btn-light">
            <i className="fa-solid fa-backward"></i>
          </button>
          <button onClick={() => onPlayPause(!isPlaying)} className="btn btn-light">
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button onClick={onForward} className="btn btn-light">
            <i className="fa-solid fa-forward"></i>
          </button>
        </div>
        <div className="progress-bar-container w-100" onClick={handleProgressBarClick}>
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
