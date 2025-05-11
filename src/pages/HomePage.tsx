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

// Word lists for different languages
const wordLists = {
  english: [
    'apple', 'banana', 'computer', 'bicycle', 'mountain', 'ocean', 
    'elephant', 'guitar', 'umbrella', 'window', 'pizza', 'castle',
    'beach', 'forest', 'island', 'library', 'coffee', 'airplane',
    'camera', 'telephone', 'diamond', 'fountain', 'keyboard', 'painting'
  ],
  german: [
    'Apfel', 'Banane', 'Computer', 'Fahrrad', 'Berg', 'Ozean', 
    'Elefant', 'Gitarre', 'Regenschirm', 'Fenster', 'Pizza', 'Schloss',
    'Strand', 'Wald', 'Insel', 'Bibliothek', 'Kaffee', 'Flugzeug',
    'Kamera', 'Telefon', 'Diamant', 'Brunnen', 'Tastatur', 'Gemälde'
  ]
};

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
  
  const handleStartGame = () => {
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
    
    // Store game data in local storage
    localStorage.setItem('players', JSON.stringify(validPlayers));
    localStorage.setItem('imposterCount', imposterCount.toString());
    localStorage.setItem('language', language);
    
    // Generate a random word for non-imposters from the selected language
    const words = wordLists[language];
    const selectedWord = words[Math.floor(Math.random() * words.length)];
    localStorage.setItem('word', selectedWord);
    
    // Navigate to game
    navigate('/game');
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
