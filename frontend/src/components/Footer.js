import React from 'react';
import './Footer.css';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import instagram from '../assets/instagram.png';
import tiktok from '../assets/tiktok.png';
import whatsapp from '../assets/whatsapp.png';
import youtube from '../assets/youtube.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contact">
        <p>sales@quizapp.com</p>
        <p>support@quizapp.com</p>
      </div>
      <div className="footer-social">
        <img src={facebook} alt="Facebook" />
        <img src={twitter} alt="Twitter" />
        <img src={instagram} alt="Instagram" />
        <img src={tiktok} alt="TikTok" />
        <img src={whatsapp} alt="WhatsApp" />
        <img src={youtube} alt="YouTube" />
      </div>
    </footer>
  );
};

export default Footer;
