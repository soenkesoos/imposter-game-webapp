// A utility to manage word history in cookies
// Stores the last 100 used words and ensures we don't repeat them

// Cookie name for storing word history
const WORD_HISTORY_COOKIE = 'imposter_word_history';

// Maximum number of words to store in history
const MAX_HISTORY_SIZE = 100;

/**
 * Get the list of previously used words from cookie
 */
export const getWordHistory = (): string[] => {
  try {
    const cookieValue = getCookie(WORD_HISTORY_COOKIE);
    if (!cookieValue) return [];
    
    return JSON.parse(cookieValue);
  } catch (error) {
    console.error('Error reading word history cookie:', error);
    return [];
  }
};

/**
 * Add a word to the history and save to cookie
 * @param word The word to add to history
 */
export const addWordToHistory = (word: string): void => {
  try {
    // Get current history
    const history = getWordHistory();
    
    // Add the new word at the beginning of the array
    const updatedHistory = [word, ...history];
    
    // Trim to max size
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE);
    
    // Save back to cookie (expires in 1 year)
    setCookie(WORD_HISTORY_COOKIE, JSON.stringify(trimmedHistory), 365);
  } catch (error) {
    console.error('Error saving word history:', error);
  }
};

/**
 * Check if a word has been used recently (exists in history)
 * @param word The word to check
 * @returns true if the word exists in history, false otherwise
 */
export const isWordInHistory = (word: string): boolean => {
  const history = getWordHistory();
  return history.includes(word);
};

/**
 * Clear the word history
 */
export const clearWordHistory = (): void => {
  setCookie(WORD_HISTORY_COOKIE, JSON.stringify([]), 365);
};

/**
 * Get the number of words in history
 * @returns The number of words in history
 */
export const getWordHistoryCount = (): number => {
  return getWordHistory().length;
};

/**
 * Utility to set a cookie
 * @param name Cookie name
 * @param value Cookie value
 * @param days Days until expiration
 */
const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * Utility to get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or empty string if not found
 */
const getCookie = (name: string): string => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  
  return '';
};
