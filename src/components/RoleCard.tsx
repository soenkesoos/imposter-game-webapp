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
const WordPanel = styled.div<{ isImposter: boolean; revealed: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background-color: ${props => props.isImposter ? 'black' : 'white'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius};
  z-index: 1; // Below the sliding card
  pointer-events: none; // Prevent interaction with this panel
  user-select: none;
  opacity: 1; //${props => props.revealed ? 1 : 0}; 
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
`;

const SlidingCard = styled.div<{ translateY: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  transform: translateY(${props => props.translateY}px);
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
  height: 30%;
  background-color: #ff5e62;
  border-bottom-left-radius: ${theme.borderRadius};
  border-bottom-right-radius: ${theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
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

const RoleTitle = styled(Title)<{ isImposter: boolean }>`
  color: ${props => props.isImposter ? 'white' : 'black'};
  font-size: 32px;
  margin-bottom: ${theme.spacing.medium};
  margin-top: 0;
  text-shadow: ${props => props.isImposter ? '0 2px 10px rgba(255, 255, 255, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.3)'};
`;

const CoverText = styled.div`
  color: black;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
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

const DraggableArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: grab;
  z-index: 3;
  
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
  const containerRef = useRef<HTMLDivElement>(null);
  const slidingCardRef = useRef<HTMLDivElement>(null);
  
  // Generate a new emoji when component mounts or player changes
  useEffect(() => {
    setPlayerEmoji(getRandomEmoji());
  }, [playerId]);
  
  // Calculate the max drag - only slide up halfway to reveal the word
  const getMaxDrag = () => {
    if (!slidingCardRef.current) return -300;
    return -slidingCardRef.current.clientHeight / 2; // Only slide half way
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    document.body.classList.add('no-scroll'); // Prevent body scrolling
    setIsDragging(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !slidingCardRef.current) return;
    
    const touch = e.touches[0];
    const containerRect = slidingCardRef.current.getBoundingClientRect();
    const maxDrag = getMaxDrag();
    
    // Calculate new position (negative value = sliding up)
    let newPosition = -(containerRect.top - touch.clientY + 50);
    
    // Limit dragging with resistance when pulled beyond limits
    if (newPosition < maxDrag) {
      // Add resistance when pulling beyond the max
      newPosition = maxDrag + (newPosition - maxDrag) * 0.2;
    }
    
    // Don't allow positive drag (sliding down beyond initial position)
    newPosition = Math.min(0, newPosition);
    
    setDragPosition(newPosition);
    
    if (newPosition < maxDrag / 2) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }
    
    e.preventDefault();
  };
  
  const handleTouchEnd = () => {
    document.body.classList.remove('no-scroll'); // Re-enable body scrolling
    setIsDragging(false);
    
    // Spring back animation
    setSpringAnimation(true);
    setTimeout(() => {
      setDragPosition(0);
      setRevealed(false); // Make sure to hide the word when the card springs back
      setTimeout(() => {
        setSpringAnimation(false);
      }, 300);
    }, 50);
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    document.body.classList.add('no-scroll'); // Prevent body scrolling
    setIsDragging(true);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !slidingCardRef.current) return;
    
    const maxDrag = getMaxDrag();
    
    // Calculate new position (negative value = sliding up)
    let newPosition = -(slidingCardRef.current.getBoundingClientRect().top - e.clientY + 50);
    
    // Limit dragging with resistance
    if (newPosition < maxDrag) {
      newPosition = maxDrag + (newPosition - maxDrag) * 0.2;
    }
    
    // Don't allow positive drag (sliding down beyond initial position)
    newPosition = Math.min(0, newPosition);
    
    setDragPosition(newPosition);
    
    if (newPosition < maxDrag / 2) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }
  };
  
  const handleMouseUp = () => {
    document.body.classList.remove('no-scroll'); // Re-enable body scrolling
    setIsDragging(false);
    
    // Spring back animation
    setSpringAnimation(true);
    setTimeout(() => {
      setDragPosition(0);
      setRevealed(false); // Make sure to hide the word when the card springs back
      setTimeout(() => {
        setSpringAnimation(false);
      }, 300);
    }, 50);
  };
  
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && slidingCardRef.current) {
        const maxDrag = getMaxDrag();
          
        let newPosition = -(slidingCardRef.current.getBoundingClientRect().top - e.clientY + 50);
          
        if (newPosition < maxDrag) {
          newPosition = maxDrag + (newPosition - maxDrag) * 0.2;
        }
          
        // Don't allow positive drag (sliding down beyond initial position)
        newPosition = Math.min(0, newPosition);
        
        setDragPosition(newPosition);
          
        if (newPosition < maxDrag / 2) {
          setRevealed(true);
        } else {
          setRevealed(false);
        }
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        document.body.classList.remove('no-scroll');
        setIsDragging(false);
        
        setSpringAnimation(true);
        setTimeout(() => {
          setDragPosition(0);
          setRevealed(false); // Hide the word when the card springs back
          setTimeout(() => {
            setSpringAnimation(false);
          }, 300);
        }, 50);
      }
    };
    
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && slidingCardRef.current && e.touches && e.touches[0]) {
        const maxDrag = getMaxDrag();
        
        let newPosition = -(slidingCardRef.current.getBoundingClientRect().top - e.touches[0].clientY + 50);
        
        if (newPosition < maxDrag) {
          newPosition = maxDrag + (newPosition - maxDrag) * 0.2;
        }
        
        // Don't allow positive drag (sliding down beyond initial position)
        newPosition = Math.min(0, newPosition);
        
        setDragPosition(newPosition);
        
        if (newPosition < maxDrag / 2) {
          setRevealed(true);
        } else {
          setRevealed(false);
        }
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
  }, [isDragging]);
  
  return (
    <CardContainer ref={containerRef} className="no-select">
      {/* Word Panel that appears when the card slides up */}
      <WordPanel isImposter={isImposter} revealed={revealed}>
        <WordContent>
          <RoleTitle isImposter={isImposter}>
            {isImposter ? 'Impostor' : word}
          </RoleTitle>
        </WordContent>
      </WordPanel>
      
      {/* Sliding Card that covers the word */}
      <SlidingCard 
        translateY={dragPosition}
        ref={slidingCardRef}
        className={springAnimation ? 'spring-animation' : ''}
      >
        <CardContent>
          <PlayerImage>
            <PlayerAvatar>
              <span role="img" aria-label="player avatar" style={{ fontSize: '150px' }}>{playerEmoji}</span>
            </PlayerAvatar>
            
            <RevealInstruction>
              <svg viewBox="0 0 24 24">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
              </svg>
              Move up to reveal
            </RevealInstruction>
          </PlayerImage>
          
          <CardBottom>
            <CoverText>Slide up to reveal</CoverText>
          </CardBottom>
          
          <DraggableArea 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </CardContent>
      </SlidingCard>
      
      <NextButton onClick={onBack} style={{ marginTop: '530px' }}>Next Person</NextButton>
    </CardContainer>
  );
};

export default RoleCard;
