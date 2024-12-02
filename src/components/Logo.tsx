import React from 'react';
import { configService } from '../providers/configService';

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className = "h-8", style = {} }: LogoProps) {
  const logo = configService.baseUrlImage + "/event_cover/1XEVENTTEST_cover_2024_12_02_16_15_29.PNG"
  return (
    <img 
      src={logo} 
      alt="PassPro" 
      className={className}
      style={{ 
        objectFit: 'contain',
        objectPosition: 'left',
        height: '100px',
        ...style 
      }}
    />
  );
}