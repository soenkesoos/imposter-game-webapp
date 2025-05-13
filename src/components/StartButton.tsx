import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from './StyledComponents';
import Logo from './Logo';

interface StartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const peekAnimation = keyframes`
  0% { transform: translateY(100%) rotate(0deg); }
  10% { transform: translateY(30%) rotate(-5deg); }
  15% { transform: translateY(30%) rotate(5deg); }
  25% { transform: translateY(100%) rotate(0deg); }
  100% { transform: translateY(100%) rotate(0deg); }
`;

const ButtonWrapper = styled.div`
   z-index: 10;
   position: relative;
   width: 100%;
   display: flex;
   justify-content: center;
   overflow: hidden;
   margin-top: 10px;
   padding-top: 20px;
   padding-bottom: 20px; /* Add space to contain the peeking logo */
`;

const LogoContainer = styled.div<{ $isPeeking: boolean }>`
   position: absolute;
   bottom: 75%;
   right: calc(50% - 25px); /* Position relative to the center of the button */
   z-index: -1;
   transform: translateY(${props => props.$isPeeking ? '30%' : '100%'}) rotate(0deg);
   transition: transform 0.3s ease-out;
   filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));

   ${props => props.$isPeeking && css`
      animation: ${peekAnimation} 3s ease-in-out;
   `}
   `;

const StyledButton = styled(Button)`
   position: relative;
   min-width: 200px;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

   &:hover + ${LogoContainer} {
      transform: translateY(20%) rotate(-5deg);
   }
`;

const StartButton: React.FC<StartButtonProps> = ({ onClick, disabled = false, isLoading = false }) => {
  const [isPeeking, setIsPeeking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canRandomPeek, setCanRandomPeek] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Handle hover state changes
  const handleMouseEnter = () => {
    setIsHovered(true);
    setCanRandomPeek(false);
  };
  
  const handleMouseLeave = () => {
   setTimeout(() => {
    setIsHovered(false);
   }, 1000);
    
    // Prevent random peeking for a short time after hover ends
    // This avoids animation conflicts
    setTimeout(() => {
      setCanRandomPeek(true);
    }, 2000);
  };
  
  // Randomly peek out on its own
  useEffect(() => {
    const interval = setInterval(() => {
      // Only peek if not hovered and random peeking is allowed
      if (!isHovered && canRandomPeek && !disabled && Math.random() < 0.4) {
        setIsPeeking(true);
        
        // Reset peek after animation finishes
        setTimeout(() => {
          setIsPeeking(false);
        }, 100);
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isHovered, canRandomPeek, disabled]);
  
  return (
    <ButtonWrapper>
      <StyledButton 
        ref={buttonRef}
        onClick={onClick} 
        disabled={disabled}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading ? 'Loading...' : 'Start Game'}
      </StyledButton>
      <LogoContainer $isPeeking={isPeeking || isHovered}>
        <Logo size="small" type="sneaky" />
      </LogoContainer>
    </ButtonWrapper>
  );
};

export default StartButton;
