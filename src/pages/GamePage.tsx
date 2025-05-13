import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Title, 
  Button, 
  SubTitle,
  Spacer
} from '../components/StyledComponents';
import RoleCard from '../components/RoleCard';
import styled from 'styled-components';
import theme from '../styles/theme';
import Logo from '../components/Logo';

const GameContainer = styled(Container)`
  position: relative;
  max-width: 100%;
  padding: 0;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent scrolling */
  height: 100vh; /* Full viewport height */
  position: fixed; /* Fix position to prevent scrolling */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const FullWidthCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 0;
  height: 100%;
  overflow-y: auto; /* Allow scrolling within the card if needed */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: none;
  padding-top: 20px;
  padding-bottom: 30px;
  background-color: #1e1e1e;
`;

const PlayerName = styled(Title)`
  font-size: 24px;
  margin-bottom: ${theme.spacing.medium};
  color: white;
`;

const CardWrapper = styled.div`
  width: 100%;
  padding: 0 ${theme.spacing.medium};
  margin-top: 10px;
  height: 500px; /* Match the height of the RoleCard container */
  position: relative;
  overflow: visible; /* Allow card to slide up beyond the wrapper */
`;

const InstructionText = styled(SubTitle)`
  color: white;
  opacity: 0.9;
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

const StartGameView = styled.div`
  text-align: center;
  color: white;
  padding: ${theme.spacing.large};
  
  p {
    margin-bottom: ${theme.spacing.medium};
    opacity: 0.9;
  }
`;

const NewGameButton = styled(Button)`
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

interface Player {
  id: number;
  name: string;
}

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [word, setWord] = useState<string>('');
  const [language, setLanguage] = useState<string>('english');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0); // Start with the first player directly
  const [showingRole, setShowingRole] = useState<boolean>(true); // Always show role by default
  const [imposters, setImposters] = useState<number[]>([]);
  
  useEffect(() => {
    // Add class to body to prevent scrolling
    document.body.classList.add('game-page');
    
    return () => {
      // Clean up by removing the class when component unmounts
      document.body.classList.remove('game-page');
    };
  }, []);
  
  useEffect(() => {
    // Load game data from local storage
    const storedPlayers = localStorage.getItem('players');
    const storedImposterCount = localStorage.getItem('imposterCount');
    const storedWord = localStorage.getItem('word');
    const storedLanguage = localStorage.getItem('language');
    
    if (!storedPlayers || !storedImposterCount || !storedWord) {
      navigate('/');
      return;
    }
    
    const parsedPlayers = JSON.parse(storedPlayers);
    setPlayers(parsedPlayers);
    setImposterCount(Number(storedImposterCount));
    setWord(storedWord);
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // Randomly select imposters
    const playerIndexes = Array.from({ length: parsedPlayers.length }, (_, i) => i);
    const shuffled = [...playerIndexes].sort(() => 0.5 - Math.random());
    const selectedImposters = shuffled.slice(0, Number(storedImposterCount));
    
    setImposters(selectedImposters);
  }, [navigate]);
  
  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      // Next player - we don't need to toggle showingRole anymore since it's always true
      setCurrentPlayerIndex(prev => prev + 1);
    } else {
      // All players have seen their roles
      setCurrentPlayerIndex(-2); // -2 indicates end of role reveal
    }
  };
  
  const handleBackToHome = () => {
    // Clear game data
    localStorage.removeItem('players');
    localStorage.removeItem('imposterCount');
    localStorage.removeItem('word');
    localStorage.removeItem('language');
    
    navigate('/');
  };
  
  const isImposter = (playerIndex: number) => {
    return imposters.includes(playerIndex);
  };
  
  if (players.length === 0) {
    return <GameContainer>Loading...</GameContainer>;
  }
  
  // Role selection screen - now immediately shows the role card
  if (currentPlayerIndex >= 0 && currentPlayerIndex < players.length) {
    const currentPlayer = players[currentPlayerIndex];
    
    return (
      <GameContainer>
        <FullWidthCard>
          <PlayerName>{currentPlayer.name}'s Turn</PlayerName>
          <CardWrapper>
            <RoleCard
              key={currentPlayer.id} // Add key to force re-render when player changes
              isImposter={isImposter(currentPlayerIndex)}
              word={word}
              onBack={handleNextPlayer}
              playerId={currentPlayer.id} // Pass the player ID to the RoleCard
            />
          </CardWrapper>
        </FullWidthCard>
      </GameContainer>
    );
  }
  
  // Game has started (all players have seen their roles)
  if (currentPlayerIndex === -2) {
    return (
      <GameContainer>
        <FullWidthCard>
          <Title style={{ color: '#ff5e62' }}>Game Started!</Title>
          <InstructionText>All players know their roles now.</InstructionText>
          
          <StartGameView>
            <p>The game has started! All players should now discuss.</p>
            <p>Regular players know the secret word and should talk about it without directly saying it.</p>
            <p>Imposters should try to blend in without getting caught!</p> <Logo size="small" />
          </StartGameView>
          
          <Spacer size="large" />
          
          <NewGameButton onClick={handleBackToHome}>New Game</NewGameButton>
        </FullWidthCard>
      </GameContainer>
    );
  }
  
  // Fallback view - should not normally be needed but included for safety
  return (
    <GameContainer>
      <FullWidthCard>
        <Title style={{ color: 'white' }}>Loading Game...</Title>
      </FullWidthCard>
    </GameContainer>
  );
};

export default GamePage;
