// components/BoxPreloader.js
import React, { useState, useEffect } from 'react';

const BoxPreloader = ({ minDisplayTime = 2000, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return (
    <>
      {loading && (
        <div id="preloader">
          <div className="loader">
            <div className="shadow"></div>
            <div className="box"></div>
          </div>
        </div>
      )}
      
      <div style={{ 
        opacity: loading ? 0 : 1, 
        transition: 'opacity 0.5s ease',
        visibility: loading ? 'hidden' : 'visible',
        display: loading ? 'none' : 'block'
      }}>
        {children}
      </div>
      
      <style jsx global>{`
        #preloader {
          overflow: hidden;
          background: #FFFFFF;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          position: fixed;
          z-index: 9999;
        }
        
        .loader {
          position: absolute;
          top: calc(50% - 20px);
          left: calc(50% - 20px);
        }
        
        @keyframes loader {
          0% {
            left: -100px;
          }
          100% {
            left: 110%;
          }
        }
        
        .box {
          width: 50px;
          height: 50px;
          background: #0089cf;
          animation: animate 0.5s linear infinite;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 3px;
        }
        
        @keyframes animate {
          17% {
            border-bottom-right-radius: 3px;
          }
          25% {
            transform: translateY(9px) rotate(22.5deg);
          }
          50% {
            transform: translateY(18px) scale(1, 0.9) rotate(45deg);
            border-bottom-right-radius: 40px;
          }
          75% {
            transform: translateY(9px) rotate(67.5deg);
          }
          100% {
            transform: translateY(0) rotate(90deg);
          }
        }
        
        .shadow {
          width: 50px;
          height: 5px;
          background: #000;
          opacity: 0.1;
          position: absolute;
          top: 59px;
          left: 0;
          border-radius: 50%;
          animation: shadow 0.5s linear infinite;
        }
        
        @keyframes shadow {
          50% {
            transform: scale(1.2, 1);
          }
        }
      `}</style>
    </>
  );
};

export default BoxPreloader;