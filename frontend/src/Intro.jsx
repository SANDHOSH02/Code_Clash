import React, { useEffect, useState } from 'react';
import './Intro.css';
import backgroundVideo from './assets/eye.mp4';

const Intro = ({ onIntroComplete }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 500);
    const introTimer = setTimeout(() => {
      onIntroComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(introTimer);
    };
  }, [onIntroComplete]);

  return (
    <div className={`intro-container ${animate ? 'animate' : ''}`}>
      {/* <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video> */}
      <div className="intro-content">
        <h1 className="intro-text">CodeSmart AI Editor</h1>
        <p className="intro-subtext">
          Revolutionizing coding with real-time AI-driven insights
        </p>
      </div>
      <div className="background-overlay"></div>
    </div>
  );
};

export default Intro;