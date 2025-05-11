import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Title, 
  Button, 
  Select, 
  Label,
  SubTitle,
  Spacer
} from '../components/StyledComponents';
import PlayerInput from '../components/PlayerInput';

interface Player {
  id: number;
  name: string;
}

type Language = 'english' | 'german';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: '' },
    { id: 1, name: '' },
    { id: 2, name: '' }
  ]);
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [language, setLanguage] = useState<Language>('english');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const handlePlayerChange = (id: number, name: string) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === id ? { ...player, name } : player
      )
    );
  };
  
  const handleAddPlayer = () => {
    setPlayers(prev => [
      ...prev, 
      { id: prev.length > 0 ? Math.max(...prev.map(p => p.id)) + 1 : 0, name: '' }
    ]);
  };
  
  const handleRemovePlayer = (id: number) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };
  
  const handleStartGame = async () => {
    // Validate player names
    const validPlayers = players.filter(player => player.name.trim() !== '');
    
    if (validPlayers.length < 3) {
      alert('Please enter at least 3 player names');
      return;
    }
    
    if (imposterCount >= validPlayers.length) {
      alert('There must be fewer imposters than players');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Fetch a random word from a free API
      const apiUrl = language === 'english' 
        ? 'https://random-word-api.herokuapp.com/word'
        : 'https://random-word-api.herokuapp.com/word?lang=de';
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch a random word');
      }
      
      const data = await response.json();
      const word = Array.isArray(data) && data.length > 0 ? data[0] : '';
      
      if (!word) {
        throw new Error('No word received from API');
      }
      
      // Store game data in local storage
      localStorage.setItem('players', JSON.stringify(validPlayers));
      localStorage.setItem('imposterCount', imposterCount.toString());
      localStorage.setItem('language', language);
      localStorage.setItem('word', word);
      
      // Navigate to game
      navigate('/game');
    } catch (err) {
      console.error('Error fetching word:', err);
      setError('Failed to get a random word. Please try again.');
      
      // Fallback to predefined words if API fails
      const fallbackWords = {
        english: ['cat', 'dog', 'house', 'tree', 'book', 'car', 'phone', 'chair', 'shoe', 'sun'],
        german: ['Katze', 'Hund', 'Haus', 'Baum', 'Buch', 'Auto', 'Telefon', 'Stuhl', 'Schuh', 'Sonne']
      };
      
      const fallbackWord = fallbackWords[language][Math.floor(Math.random() * fallbackWords[language].length)];
      localStorage.setItem('players', JSON.stringify(validPlayers));
      localStorage.setItem('imposterCount', imposterCount.toString());
      localStorage.setItem('language', language);
      localStorage.setItem('word', fallbackWord);
      
      // Navigate to game even if API fails, using fallback word
      navigate('/game');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getImposterOptions = () => {
    const maxImposters = Math.max(1, Math.floor(players.length / 2) - 1);
    const options = [];
    
    for (let i = 1; i <= maxImposters; i++) {
      options.push(
        <option key={i} value={i}>
          {i} {i === 1 ? 'Imposter' : 'Imposters'}
        </option>
      );
    }
    
    return options;
  };

  return (
    <Container>
      <Card>
        <Title>Imposter Game</Title>
        
        <SubTitle>Players</SubTitle>
        {players.map((player, index) => (
          <PlayerInput
            key={player.id}
            id={player.id}
            name={player.name}
            onChange={handlePlayerChange}
            onRemove={handleRemovePlayer}
            canRemove={players.length > 3 && index !== 0}
          />
        ))}
        
        <Button 
          secondary 
          type="button" 
          onClick={handleAddPlayer}
        >
          Add Player
        </Button>
        
        <Spacer size="large" />
        
        <Label htmlFor="imposterCount">Number of Imposters</Label>
        <Select
          id="imposterCount"
          value={imposterCount}
          onChange={(e) => setImposterCount(Number(e.target.value))}
        >
          {getImposterOptions()}
        </Select>
        
        <Spacer size="medium" />
        
        <Label htmlFor="languageSelect">Language for Words</Label>
        <Select
          id="languageSelect"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          <option value="english">English</option>
          <option value="german">German</option>
        </Select>
        
        <Spacer size="medium" />
        
        <Button 
          type="button" 
          onClick={handleStartGame}
        >
          Start Game
        </Button>
      </Card>
    </Container>
  );
};

export default HomePage;
