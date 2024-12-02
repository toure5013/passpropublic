import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className = "h-8", style = {} }: LogoProps) {
  return (
    <img 
      src="/assets/images/logo 1.svg" 
      alt="PassPro" 
      className={className}
      style={{ 
        objectFit: 'contain',
        objectPosition: 'left',
        ...style 
      }}
    />
  );
}