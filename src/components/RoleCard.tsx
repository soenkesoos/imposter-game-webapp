import React from 'react';
import styled from 'styled-components';
import { Card, Title, Button } from './StyledComponents';
import theme from '../styles/theme';

interface RoleCardProps {
  isImposter: boolean;
  word: string;
  onBack: () => void;
}

const RoleContainer = styled(Card)<{ isImposter: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: ${props => 
    props.isImposter ? `${theme.colors.imposter}20` : `${theme.colors.regular}20`};
  border: 2px solid ${props => 
    props.isImposter ? theme.colors.imposter : theme.colors.regular};
`;

const RoleTitle = styled(Title)<{ isImposter: boolean }>`
  color: ${props => 
    props.isImposter ? theme.colors.imposter : theme.colors.regular};
  font-size: 32px;
`;

const RoleText = styled.p`
  font-size: 20px;
  text-align: center;
  margin: ${theme.spacing.large} 0;
`;

const RoleCard: React.FC<RoleCardProps> = ({ isImposter, word, onBack }) => {
  return (
    <RoleContainer isImposter={isImposter}>
      <RoleTitle isImposter={isImposter}>
        {isImposter ? 'You are the IMPOSTER!' : 'You are a REGULAR player'}
      </RoleTitle>
      <RoleText>
        {isImposter 
          ? 'Try to blend in while figuring out the word. Don\'t get caught!'
          : `The word is: ${word}`}
      </RoleText>
      <Button onClick={onBack}>Back</Button>
    </RoleContainer>
  );
};

export default RoleCard;
