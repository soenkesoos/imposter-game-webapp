import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Title, Button } from './StyledComponents';
import theme from '../styles/theme';
import { faker } from '@faker-js/faker';

// Function to get a random emoji
const getRandomEmoji = () => {
  return faker.internet.emoji({ types: ['person'] });
};
/*
  | 'smiley'
  | 'body'
  | 'person'
  | 'nature'
  | 'food'
  | 'travel'
  | 'activity'
  | 'object'
  | 'symbol'
  | 'flag';
  */

interface RoleCardProps {
  isImposter: boolean;
  word: string;
  onBack: () => void;
  playerId?: number; // Add playerId prop to detect player changes
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  height: 500px;
`;

// Word panel positioned below the card
const WordPanel = styled.div<{ $isImposter: boolean; $revealed: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background-color: ${props => props.$isImposter ? 'black' : 'white'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius};
  z-index: 1; // Below the sliding card
  pointer-events: none; // Prevent interaction with this panel
  user-select: none;
  opacity: ${props => props.$revealed ? 1 : 1}; // We're setting opacity to 1 regardless now
  transition: opacity 0.2s ease-in;
  box-shadow: ${theme.boxShadow};
`;

const WordContent = styled.div`
  padding: ${theme.spacing.large};
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none; /* Prevent text selection */
  -webkit-user-select: none; /* For Safari */
  -moz-user-select: none; /* For Firefox */
  -ms-user-select: none; /* For IE10+/Edge */
  pointer-events: none; /* Additionally prevents interactions */
`;

const SlidingCard = styled.div<{ $translateY: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  transform: translateY(${props => props.$translateY}px);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
  overflow: hidden;
  z-index: 2; // Above the word panel
  background-color: #ff5e62; // Add background color to cover the word panel
  will-change: transform; // Optimize animations
  border: 2px solid rgba(255, 255, 255, 0.5); // Add subtle white outline
`;

const CardContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ff5e62;
`;

const PlayerImage = styled.div`
  width: 100%;
  height: 70%;
  border-top-left-radius: ${theme.borderRadius};
  border-top-right-radius: ${theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #ff9966, #ff5e62);
`;

const CardBottom = styled.div`
  width: 100%;
  height: 40%;
  background-color: #ff5e62;
  border-bottom-left-radius: ${theme.borderRadius};
  border-bottom-right-radius: ${theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none; // Prevent text selection
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 5px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-top: 10px;
  }
`;

const PlayerAvatar = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 40px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const RevealInstruction = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: black;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  svg {
    width: 24px;
    height: 24px;
    fill: black;
    margin-bottom: 5px;
  }
`;

const RoleTitle = styled(Title)<{ $isImposter: boolean }>`
  color: ${props => props.$isImposter ? 'white' : 'black'};
  font-size: 32px;
  margin-bottom: ${theme.spacing.medium};
  margin-top: 0;
  text-shadow: ${props => props.$isImposter ? '0 2px 10px rgba(255, 255, 255, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.3)'};
  user-select: none; /* Prevent text selection */
  -webkit-user-select: none; /* For Safari */
  -moz-user-select: none; /* For Firefox */
  -ms-user-select: none; /* For IE10+/Edge */
  pointer-events: none; /* Additionally prevents interactions */
`;

const CoverText = styled.div`
  color: black;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  user-select: none; // Prevent text selection
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  }
`;

const NextButton = styled(Button)`
  margin-top: 20px;
  width: 90%;
  max-width: 300px;
  background-color: #ff5e62;
  font-size: 18px;
  padding: 15px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(255, 94, 98, 0.3);
  transition: all 0.2s ease;
  
  &:active {
    transform: translateY(4px);
    box-shadow: 0 1px 5px rgba(255, 94, 98, 0.3);
  }
`;

// DraggableArea now covers the entire card 
const DraggableArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: grab;
  z-index: 40; /* Even higher z-index to ensure it's above everything */
  touch-action: none; /* Prevent browser handling of touch events */
  background-color: transparent; /* Make it invisible but still interactive */
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on iOS */
  -webkit-touch-callout: none; /* Disable callout on long-press */
  -webkit-user-select: none; /* Disable selection on iOS */
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`;

const RoleCard: React.FC<RoleCardProps> = ({ isImposter, word, onBack, playerId }) => {
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [springAnimation, setSpringAnimation] = useState(false);
  const [playerEmoji, setPlayerEmoji] = useState('');
  const [initialTouchY, setInitialTouchY] = useState<number | null>(null);
  const [initialMouseY, setInitialMouseY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidingCardRef = useRef<HTMLDivElement>(null);
  
  // Generate a new emoji when component mounts or player changes
  useEffect(() => {
    setPlayerEmoji(getRandomEmoji());
  }, [playerId]);
  
  // Calculate the max drag - only slide up halfway to reveal the word
  const getMaxDrag = () => {
    if (!slidingCardRef.current) return -300;
    return -slidingCardRef.current.clientHeight * 0.2; // Only slide half way
  };
  
  // Common drag position calculation logic
  const calculateDragPosition = (delta: number) => {
    const maxDrag = getMaxDrag();
    
    // Calculate new position based on the delta
    let newPosition = -delta;
    
    // Apply resistance when pulled beyond limits
    if (newPosition < maxDrag) {
      newPosition = maxDrag + (newPosition - maxDrag) * 0.15;
    }
    
    // Don't allow positive drag (sliding down beyond initial position)
    newPosition = Math.min(0, newPosition);
    
    // Apply the position
    setDragPosition(newPosition);
    
    // Update revealed state based on position
    if (newPosition < maxDrag / 2) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }
  };
  
  // Common handler for ending drag
  const endDrag = () => {
    document.body.classList.remove('no-scroll');
    setIsDragging(false);
    setInitialTouchY(null);
    setInitialMouseY(null);
    
    // Spring back animation
    setSpringAnimation(true);
    setTimeout(() => {
      setDragPosition(0);
      setRevealed(false);
      setTimeout(() => {
        setSpringAnimation(false);
      }, 300);
    }, 50);
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default on touchStart for iOS compatibility
    // This helps ensure iOS devices recognize the touch event properly
    document.body.classList.add('no-scroll'); // Prevent body scrolling
    setIsDragging(true);
    
    // Immediately start processing the touch to avoid needing to drag outside the card
    if (e.touches && e.touches[0] && slidingCardRef.current) {
      const touch = e.touches[0];
      setInitialTouchY(touch.clientY); // Store the initial touch position
      // We don't actually move the card here, just establish that we're ready to drag
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !slidingCardRef.current || initialTouchY === null) return;

    // Prevent default to avoid scrolling on iOS
    e.preventDefault();
    
    const touch = e.touches[0];
    const touchDelta = initialTouchY - touch.clientY;
    calculateDragPosition(touchDelta);
  };
  
  const handleTouchEnd = () => {
    endDrag();
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    document.body.classList.add('no-scroll'); // Prevent body scrolling
    setIsDragging(true);
    setInitialMouseY(e.clientY); // Store the initial mouse position
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !slidingCardRef.current || initialMouseY === null) return;
    
    const mouseDelta = initialMouseY - e.clientY;
    calculateDragPosition(mouseDelta);
  };
  
  const handleMouseUp = () => {
    endDrag();
  };
  
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && slidingCardRef.current && initialMouseY !== null) {
        const mouseDelta = initialMouseY - e.clientY;
        calculateDragPosition(mouseDelta);
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        endDrag();
      }
    };
    
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && slidingCardRef.current && e.touches && e.touches[0] && initialTouchY !== null) {
        // Prevent default to stop scrolling
        e.preventDefault();
        
        const touchDelta = initialTouchY - e.touches[0].clientY;
        calculateDragPosition(touchDelta);
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalMouseUp);
      document.body.classList.remove('no-scroll');
    };
  }, [isDragging, initialTouchY, initialMouseY]);
  
  return (
    <CardContainer ref={containerRef} className="no-select">
      {/* Word Panel that appears when the card slides up */}
      <WordPanel $isImposter={isImposter} $revealed={revealed}>
        <WordContent>
          <RoleTitle $isImposter={isImposter}>
            {isImposter ? 'Impostor' : word}
          </RoleTitle>
        </WordContent>
      </WordPanel>
      
      {/* Sliding Card that covers the word */}
      <SlidingCard 
        $translateY={dragPosition}
        ref={slidingCardRef}
        className={springAnimation ? 'spring-animation' : ''}
      >
        <CardContent>
          <PlayerImage>
            <PlayerAvatar>
              <span role="img" aria-label="player avatar" style={{ fontSize: '150px' }}>{playerEmoji}</span>
            </PlayerAvatar>
           
          </PlayerImage>
          
          <CardBottom>
            <CoverText>
              <svg viewBox="0 0 24 24" style={{ width: '24px', height: '24px', marginBottom: '8px' }}>
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
              </svg>
              <div>Slide up to reveal</div>
            </CoverText>
          </CardBottom>
          
          <DraggableArea 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </CardContent>
      </SlidingCard>
      
      <NextButton onClick={onBack} style={{ marginTop: '530px' }}>Next Person</NextButton>
    </CardContainer>
  );
};

export default RoleCard;
