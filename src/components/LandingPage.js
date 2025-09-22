import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rvu-blue to-rvu-teal flex items-center justify-center">
      <div className="text-center cursor-pointer" onClick={handleClick}>
        {/* RV Logo */}
        <div className="mb-8">
          <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center shadow-2xl hover-lift p-6">
            <img 
              src="/rv logo.jpeg" 
              alt="RV University Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        {/* University Title */}
        <h1 className="text-6xl md:text-8xl font-university font-bold text-white mb-4 hover-lift">
          RV UNIVERSITY
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 font-light">
          Go, change the world
        </p>
        
        {/* Click instruction */}
        <p className="text-sm text-white/70 mt-8 animate-pulse">
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
