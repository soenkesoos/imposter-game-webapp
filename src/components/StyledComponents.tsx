import styled from 'styled-components';
import theme from '../styles/theme';

export const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: ${theme.spacing.medium};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const Button = styled.button<{ secondary?: boolean }>`
  background-color: ${props => props.secondary ? theme.colors.secondary : theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.medium};
  font-size: 16px;
  font-weight: bold;
  margin: ${theme.spacing.small} 0;
  box-shadow: ${theme.boxShadow};
  transition: transform 0.2s, opacity 0.2s;
  
  &:active {
    transform: translateY(2px);
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: ${theme.colors.gray};
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: ${theme.spacing.medium};
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius};
  margin-bottom: ${theme.spacing.medium};
  width: 100%;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
  }
`;

export const Select = styled.select`
  padding: ${theme.spacing.medium};
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius};
  margin-bottom: ${theme.spacing.medium};
  width: 100%;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
  }
`;

export const Card = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius};
  padding: ${theme.spacing.large};
  box-shadow: ${theme.boxShadow};
  margin: ${theme.spacing.medium} 0;
  width: 100%;
`;

export const Title = styled.h1`
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.large};
  text-align: center;
`;

export const SubTitle = styled.h2`
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium};
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.small};
  font-weight: bold;
`;

export const Spacer = styled.div<{ size: 'small' | 'medium' | 'large' | string }>`
  height: ${props => 
    props.size === 'small' || props.size === 'medium' || props.size === 'large' 
      ? theme.spacing[props.size] 
      : props.size
  };
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: ${theme.spacing.medium};
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${theme.colors.secondary};
  }
`;
