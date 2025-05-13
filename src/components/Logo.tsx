import React from 'react';
import styled from 'styled-components';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
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

const Logo: React.FC<LogoProps> = ({ size = 'medium', className }) => {
  // Choose the appropriate logo size based on the size prop
  const logoSrc = () => {
    switch(size) {
      case 'small': return '/mask_32px.png';
      case 'medium': return '/logo128.png';
      case 'large': return '/logo256.png';
      default: return '/logo128.png';
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
