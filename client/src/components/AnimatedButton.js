import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const AnimatedButton = ({ onClick, disabled, label, ...props }) => {
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
    // This is used to prepare the data before submission
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

  // Dynamic styles based on state
  const getButtonClasses = () => {
    if (isRunning) return "animated-btn animated-btn--running";
    if (isDone) return "animated-btn animated-btn--done";
    return "animated-btn";
  };

  // Hardcoded colors to ensure consistency regardless of theme
  const blueColor = "#3b82f6";       // Primary blue
  const darkBlueColor = "#2563eb";   // Darker blue for hover
  const lightGrayColor = "#e2e8f0";  // Light gray for backgrounds
  const whiteColor = "#ffffff";      // White for text

  return (
    <Box 
      sx={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto', // Center the button
        '& .animated-btn': {
          backgroundColor: 'transparent',
          borderRadius: '1.5em',
          display: 'block',
          position: 'relative',
          width: '100%',
          height: '3.5em',
          transition: 'width 0.3s ease-in-out',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
          '&:not(:disabled):active': {
            transform: 'translateY(0.1em)',
          },
          border: 'none',
          outline: 'none',
        },
        '& .animated-btn__text': {
          backgroundColor: blueColor, // Hardcoded blue
          borderRadius: 'inherit',
          color: whiteColor, // Hardcoded white
          display: 'inline-block',
          padding: '0.75em 1.5em',
          fontSize: '1.1rem',
          transition: 'background-color 0.15s linear, color 0.15s 0.3s ease-in-out',
          width: '100%',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
        },
        '& .animated-btn:not(:disabled):hover .animated-btn__text': {
          backgroundColor: darkBlueColor, // Hardcoded darker blue
        },
        '& .animated-btn__progress': {
          overflow: 'visible',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3.5em',
          height: '3.5em',
          visibility: 'hidden',
        },
        '& .animated-btn__progress-track': {
          stroke: lightGrayColor, // Hardcoded light gray
          strokeWidth: 24,
        },
        '& .animated-btn__progress-fill': {
          stroke: blueColor, // Hardcoded blue
          strokeDashoffset: 125.66,
        },
        '& .animated-btn__progress-check': {
          stroke: whiteColor, // Hardcoded white
          strokeDashoffset: 34,
        },
        // Both states
        '& .animated-btn--running, & .animated-btn--done': {
          outline: 'none',
          pointerEvents: 'none',
          width: '3.5em',
          userSelect: 'none',
          margin: '0 auto', // Keep centered during animation
        },
        '& .animated-btn--running .animated-btn__text, & .animated-btn--done .animated-btn__text': {
          color: 'transparent',
          transition: 'background-color 0.3s ease-in-out, visibility 0.3s steps(1)',
        },
        '& .animated-btn--running .animated-btn__progress, & .animated-btn--done .animated-btn__progress': {
          visibility: 'visible',
        },
        // Running state
        '& .animated-btn--running .animated-btn__text': {
          backgroundColor: lightGrayColor, // Hardcoded light gray
          visibility: 'hidden',
        },
        '& .animated-btn--running .animated-btn__progress': {
          transition: 'visibility 0.3s 0.3s steps(1,start)',
        },
        '& .animated-btn--running .animated-btn__progress-track': {
          r: '20px',
          strokeWidth: 8,
          transition: 'r 0.3s 0.3s ease-in-out, stroke-width 0.3s 0.3s ease-in-out',
        },
        '& .animated-btn--running .animated-btn__progress-fill': {
          strokeDashoffset: 0,
          transition: 'stroke-dashoffset 2s 0.6s linear',
        },
        // Done state
        '& .animated-btn--done .animated-btn__progress-track': {
          stroke: blueColor, // Hardcoded blue
          transition: 'r 0.3s ease-in-out, stroke-width 0.3s ease-in-out',
        },
        '& .animated-btn--done .animated-btn__progress-check': {
          strokeDashoffset: 0,
          transition: 'stroke-dashoffset 0.3s 0.3s ease-out',
        },
        // Disabled state
        '& .animated-btn:disabled': {
          opacity: 0.7,
          cursor: 'not-allowed',
        },
        ...props.sx
      }}
    >
      <button 
        className={getButtonClasses()}
        disabled={disabled || isRunning || isDone}
        onClick={handleClick}
        type="button"
      >
        <span className="animated-btn__text">{label}</span>
        <svg className="animated-btn__progress" viewBox="0 0 48 48" width="48px" height="48px">
          <circle className="animated-btn__progress-track" r="12" cx="24" cy="24" fill="none" stroke={lightGrayColor} strokeWidth="24" />
          <circle className="animated-btn__progress-fill" r="20" cx="24" cy="24" fill="none" stroke={blueColor} strokeWidth="8" transform="rotate(-90,24,24)" strokeDasharray="125.66 125.66" strokeDashoffset="125.66" />
          <polyline className="animated-btn__progress-check" points="12,24 20,32 36,16" fill="none" stroke={whiteColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="34 34" strokeDashoffset="34" />
        </svg>
      </button>
    </Box>
  );
};

export default AnimatedButton;