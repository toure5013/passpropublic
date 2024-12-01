import React from 'react';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className = "h-8", style = {} }: LogoProps) {
  return (

    // src="/assets/images/Logo.PNG" 


    <img 
      src="https://web.passpro.app/assets/images/pass-pro.png" 
      alt="PassPro" 
      className={className}
      style={{ 
        objectFit: 'contain',
        objectPosition: 'left',
        width: '180%',
        ...style 
      }}
    />
  );
}