import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className = "h-8", style = {} }: LogoProps) {
  return (
    <img 
      src="/assets/images/Logo.PNG" 
      alt="PassPro" 
      className={className}
      style={{ 
        objectFit: 'contain',
        objectPosition: 'left',
        width: '100px',
        height: '100px',
        ...style 
      }}
    />
  );
}