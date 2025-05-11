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
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(-1);
  const [showingRole, setShowingRole] = useState<boolean>(false);
  const [imposters, setImposters] = useState<number[]>([]);
  
  useEffect(() => {
    // Load game data from local storage
    const storedPlayers = localStorage.getItem('players');
    const storedImposterCount = localStorage.getItem('imposterCount');
    const storedWord = localStorage.getItem('word');
    
    if (!storedPlayers || !storedImposterCount || !storedWord) {
      navigate('/');
      return;
    }
    
    const parsedPlayers = JSON.parse(storedPlayers);
    setPlayers(parsedPlayers);
    setImposterCount(Number(storedImposterCount));
    setWord(storedWord);
    
    // Randomly select imposters
    const playerIndexes = Array.from({ length: parsedPlayers.length }, (_, i) => i);
    const shuffled = [...playerIndexes].sort(() => 0.5 - Math.random());
    const selectedImposters = shuffled.slice(0, Number(storedImposterCount));
    
    setImposters(selectedImposters);
  }, [navigate]);
  
  const handleNextPlayer = () => {
    if (currentPlayerIndex === -1) {
      // First player
      setCurrentPlayerIndex(0);
    } else if (currentPlayerIndex < players.length - 1) {
      // Next player
      setCurrentPlayerIndex(prev => prev + 1);
      setShowingRole(false);
    } else {
      // All players have seen their roles
      setCurrentPlayerIndex(-2); // -2 indicates end of role reveal
      setShowingRole(false);
    }
  };
  
  const handleShowRole = () => {
    setShowingRole(true);
  };
  
  const handleBackToHome = () => {
    // Clear game data
    localStorage.removeItem('players');
    localStorage.removeItem('imposterCount');
    localStorage.removeItem('word');
    
    navigate('/');
  };
  
  const isImposter = (playerIndex: number) => {
    return imposters.includes(playerIndex);
  };
  
  if (players.length === 0) {
    return <Container>Loading...</Container>;
  }
  
  // Role selection screen
  if (currentPlayerIndex >= 0 && currentPlayerIndex < players.length) {
    const currentPlayer = players[currentPlayerIndex];
    
    return (
      <Container>
        <Card>
          <Title>{currentPlayer.name}'s Turn</Title>
          
          {!showingRole ? (
            <>
              <SubTitle>Ready to see if you're an imposter?</SubTitle>
              <Spacer size="large" />
              <Button onClick={handleShowRole}>Show My Status</Button>
            </>
          ) : (
            <RoleCard
              isImposter={isImposter(currentPlayerIndex)}
              word={word}
              onBack={handleNextPlayer}
            />
          )}
        </Card>
      </Container>
    );
  }
  
  // Game has started (all players have seen their roles)
  if (currentPlayerIndex === -2) {
    return (
      <Container>
        <Card>
          <Title>Game Started!</Title>
          <SubTitle>All players know if they are an imposter or not.</SubTitle>
          
          <Spacer size="large" />
          
          <p>The game has started! All players should now discuss.</p>
          <p>Regular players know the secret word and should talk about it without directly saying it.</p>
          <p>Imposters should try to blend in without getting caught!</p>
          
          <Spacer size="large" />
          
          <Button onClick={handleBackToHome}>New Game</Button>
        </Card>
      </Container>
    );
  }
  
  // Initial screen
  return (
    <Container>
      <Card>
        <Title>Imposter Game</Title>
        <SubTitle>Pass the device around</SubTitle>
        
        <Spacer size="large" />
        
        <p>Each player will get to see if they are an imposter or not.</p>
        <p>Non-imposters will see the secret word.</p>
        <p>Don't show your screen to other players!</p>
        
        <Spacer size="large" />
        
        <Button onClick={handleNextPlayer}>Start</Button>
      </Card>
    </Container>
  );
};

export default GamePage;
