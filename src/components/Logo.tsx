import React from 'react';
import styled from 'styled-components';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  type?: 'normal' | 'mask' | 'sneaky';
}

const LogoImage = styled.img<{ $size: string }>`
  width: ${props => {
    switch(props.$size) {
      case 'small': return '32px';
      case 'medium': return '64px';
      case 'large': return '128px';
      default: return '64px';
    }
  }};
  height: auto;
  object-fit: contain;
`;

const Logo: React.FC<LogoProps> = ({ size = 'medium', className, type = 'normal' }) => {
  // Choose the appropriate logo size based on the size prop
  const logoSrc = () => {
    if (type === 'mask') {
      switch(size) {
        case 'small': return '/mask_32px.png';
        case 'medium': return '/mask_64px.png';
        case 'large': return '/mask_64px.png';
        default: return '/mask_32px.png';
      }
    } else if (type === 'sneaky') {
      return '/mask_32px.png'; // Use the mask icon for sneaky imposter
    } else {
      switch(size) {
        case 'small': return '/logo128.png';
        case 'medium': return '/logo128.png';
        case 'large': return '/logo256.png';
        default: return '/logo128.png';
      }
    }
  };

  return (
    <LogoImage 
      src={logoSrc()} 
      alt="Imposter Game Logo" 
      $size={size}
      className={className}
    />
  );
};

export default Logo;
