import React from 'react';
import styled from 'styled-components';
import { 
  FlexRow, 
  Input, 
  IconButton,
  Label
} from './StyledComponents';
import theme from '../styles/theme';

interface PlayerInputProps {
  id: number;
  name: string;
  onChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

const PlayerInputContainer = styled(FlexRow)`
  margin-bottom: ${theme.spacing.small};
`;

const PlayerInput: React.FC<PlayerInputProps> = ({ 
  id, 
  name, 
  onChange, 
  onRemove,
  canRemove
}) => {
  return (
    <PlayerInputContainer>
      <Input
        type="text"
        placeholder={`Player ${id + 1}`}
        value={name}
        onChange={(e) => onChange(id, e.target.value)}
      />
      {canRemove && (
        <IconButton 
          type="button" 
          onClick={() => onRemove(id)}
          aria-label="Remove player"
        >
          ×
        </IconButton>
      )}
    </PlayerInputContainer>
  );
};

export default PlayerInput;
