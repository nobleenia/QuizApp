import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingIcon.css';
import { FiMessageCircle } from 'react-icons/fi';

const FloatingIcon = () => {
  const navigate = useNavigate();

  return (
    <div className="floating-icon" onClick={() => navigate('/community')}>
      <FiMessageCircle size={30} />
    </div>
  );
};

export default FloatingIcon;
