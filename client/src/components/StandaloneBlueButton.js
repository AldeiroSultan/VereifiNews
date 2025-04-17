import React, { useState, useEffect, useRef } from 'react';

const StandaloneBlueButton = ({ onClick, disabled, label, ...props }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const timeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleClick = async () => {
    if (disabled || isRunning || isDone) return;

    // Start animation
    setIsRunning(true);
    
    // Call the onPrepare function if provided
    if (props.onPrepare) {
      props.onPrepare();
    }
    
    // Animation timing
    const submitDuration = 2000;
    const resetDuration = 500;

    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);

    // Set timeout for completion
    timeoutRef.current = setTimeout(() => {
      setIsRunning(false);
      setIsDone(true);
      
      // After animation completes, call the onClick handler
      if (onClick) onClick();
      
      // Reset button after a brief moment
      resetTimeoutRef.current = setTimeout(() => {
        setIsDone(false);
      }, resetDuration);
    }, submitDuration + 600); // 600ms matches the CSS transition delay
  };

  // Container styles
  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto'
  };

  // Button base styles
  const buttonStyle = {
    backgroundColor: 'transparent',
    borderRadius: '1.5em',
    display: 'block',
    position: 'relative',
    width: isRunning || isDone ? '3.5em' : '100%',
    height: '3.5em',
    transition: 'width 0.3s ease-in-out',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
    border: 'none',
    outline: 'none',
    margin: '0 auto',
    cursor: disabled || isRunning || isDone ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    padding: 0
  };

  // Text styles
  const textStyle = {
    display: 'inline-block',
    width: '100%',
    backgroundColor: '#3b82f6', // Blue
    color: '#ffffff',
    borderRadius: 'inherit',
    padding: '0.75em 1.5em',
    fontSize: '1.1rem',
    fontWeight: 600,
    transition: 'background-color 0.15s linear, color 0.15s 0.3s ease-in-out',
    visibility: isRunning ? 'hidden' : 'visible',
    ...(isRunning || isDone ? { color: 'transparent' } : {})
  };

  // Progress container styles
  const progressStyle = {
    overflow: 'visible',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3.5em',
    height: '3.5em',
    visibility: isRunning || isDone ? 'visible' : 'hidden'
  };

  return (
    <div style={containerStyle}>
      <button 
        style={buttonStyle}
        disabled={disabled || isRunning || isDone}
        onClick={handleClick}
        type="button"
      >
        <span style={textStyle}>{label}</span>
        <svg style={progressStyle} viewBox="0 0 48 48" width="48px" height="48px">
          <circle 
            r={isRunning ? '20' : '12'} 
            cx="24" 
            cy="24" 
            fill="none" 
            stroke={isRunning ? "#e2e8f0" : (isDone ? "#3b82f6" : "#e2e8f0")} 
            strokeWidth={isRunning ? 8 : 24} 
          />
          <circle 
            r="20" 
            cx="24" 
            cy="24" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="8" 
            transform="rotate(-90,24,24)" 
            strokeDasharray="125.66 125.66" 
            strokeDashoffset={isRunning ? "0" : "125.66"} 
            style={isRunning ? {transition: 'stroke-dashoffset 2s 0.6s linear'} : {}}
          />
          <polyline 
            points="12,24 20,32 36,16" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeDasharray="34 34" 
            strokeDashoffset={isDone ? "0" : "34"} 
            style={isDone ? {transition: 'stroke-dashoffset 0.3s 0.3s ease-out'} : {}}
          />
        </svg>
      </button>
    </div>
  );
};

export default StandaloneBlueButton;