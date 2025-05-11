import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body, #root {
    height: 100%;
    width: 100%;
  }
  
  body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  button {
    cursor: pointer;
    font-family: ${theme.fonts.main};
  }
  
  input, button, select {
    font-size: 16px; /* Prevent zoom on focus in iOS */
  }
`;

export default GlobalStyle;
