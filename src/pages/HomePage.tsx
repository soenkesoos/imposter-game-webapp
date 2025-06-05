import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { faker as fakerEN } from '@faker-js/faker';
import { fakerDE } from '@faker-js/faker';
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
import Logo from '../components/Logo';
import StartButton from '../components/StartButton';
import styled from 'styled-components';
import { getWordHistory, addWordToHistory, isWordInHistory } from '../utils/wordHistory';

interface Player {
  id: number;
  name: string;
}

type Language = 'english' | 'german';

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const GameTitle = styled.h1`
  color: #ff5e62;
  font-size: 32px;
  margin: 10px 0;
  text-align: center;
`;

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
  
  // Load saved settings and player names when component mounts
  useEffect(() => {
    try {
      // Load saved language preference
      const savedLanguage = localStorage.getItem('savedLanguage');
      if (savedLanguage === 'english' || savedLanguage === 'german') {
        setLanguage(savedLanguage);
      }
      
      // Load saved imposter count
      const savedImposterCount = localStorage.getItem('savedImposterCount');
      if (savedImposterCount) {
        const count = parseInt(savedImposterCount, 10);
        if (!isNaN(count) && count > 0) {
          setImposterCount(count);
        }
      }
      
      // Load saved player names
      const savedPlayers = localStorage.getItem('savedPlayers');
      if (savedPlayers) {
        try {
          const parsedPlayers = JSON.parse(savedPlayers);
          if (Array.isArray(parsedPlayers) && parsedPlayers.length >= 3) {
            setPlayers(parsedPlayers);
          }
        } catch (e) {
          console.error('Error parsing saved players:', e);
        }
      }
    } catch (e) {
      console.error('Error loading saved settings:', e);
    }
  }, []);
  
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
  
  /**
   * Generate a unique word that hasn't been used in the last 100 games
   */
  const generateUniqueWord = (lang: Language): string => {
    const wordHistory = getWordHistory();
    
    // Log current word history for debugging
    console.debug(`Current word history (${wordHistory.length} words):`, wordHistory);
    
    // Maximum number of attempts to find a unique word
    const maxAttempts = 20;
    
    // Try to find a unique word
    for (let i = 0; i < maxAttempts; i++) {
      const word = lang === 'english' 
        ? fakerEN.word.noun()
        : fakerDE.word.noun();
      
      // If the word is not in history, use it
      if (!wordHistory.includes(word)) {
        console.debug(`Found unique word: ${word} (attempt ${i + 1}/${maxAttempts})`);
        return word;
      }
      
      console.debug(`Word "${word}" is in history, trying again...`);
    }
    
    // If we couldn't find a unique word after max attempts,
    // force a unique word by adding a random number to it
    const baseWord = lang === 'english' 
        ? fakerEN.word.noun()
        : fakerDE.word.noun();
    
    console.debug(`Couldn't find unique word after ${maxAttempts} attempts, using: ${baseWord}`);
    return baseWord;
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
      // Generate a random unique word not in the history
      const word = generateUniqueWord(language);
      
      // Add the word to history
      addWordToHistory(word);
      
      // Store game data in local storage
      localStorage.setItem('players', JSON.stringify(validPlayers));
      localStorage.setItem('imposterCount', imposterCount.toString());
      localStorage.setItem('language', language);
      localStorage.setItem('word', word);
      
      // Save settings for future games
      localStorage.setItem('savedPlayers', JSON.stringify(validPlayers));
      localStorage.setItem('savedImposterCount', imposterCount.toString());
      localStorage.setItem('savedLanguage', language);
      
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
      
      // Try to find a fallback word that's not in history
      let fallbackWord = '';
      const history = getWordHistory();
      
      const availableFallbacks = fallbackWords[language].filter(w => !history.includes(w));
      
      if (availableFallbacks.length > 0) {
        // Use a random word from the available fallbacks
        fallbackWord = availableFallbacks[Math.floor(Math.random() * availableFallbacks.length)];
      } else {
        // If all fallbacks are in history, just use any random fallback
        fallbackWord = fallbackWords[language][Math.floor(Math.random() * fallbackWords[language].length)];
      }
      
      // Add the fallback word to history
      addWordToHistory(fallbackWord);
      
      localStorage.setItem('players', JSON.stringify(validPlayers));
      localStorage.setItem('imposterCount', imposterCount.toString());
      localStorage.setItem('language', language);
      localStorage.setItem('word', fallbackWord);
      
      // Save settings for future games
      localStorage.setItem('savedPlayers', JSON.stringify(validPlayers));
      localStorage.setItem('savedImposterCount', imposterCount.toString());
      localStorage.setItem('savedLanguage', language);
      
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
        <LogoContainer>
          <Logo size="large" />
          <GameTitle>Imposter Game</GameTitle>
        </LogoContainer>
        
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
        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Random nouns will be generated locally (words won't repeat for 100 games)
        </p>
        
        <Spacer size="medium" />
        
        <StartButton 
          onClick={handleStartGame}
          disabled={isLoading}
          isLoading={isLoading}
        />
        
        {error && (
          <>
            <Spacer size="medium" />
            <p style={{ color: 'red' }}>{error}</p>
          </>
        )}
      </Card>
    </Container>
  );
};

export default HomePage;
