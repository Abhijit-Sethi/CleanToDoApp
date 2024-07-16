import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      lightText: string;
      border: string;
      success: string;
      danger: string;
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
    borderRadius: string;
    shadows: {
      small: string;
      medium: string;
    };
  }
}

const customTheme: DefaultTheme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#ffffff',
    text: '#333333',
    lightText: '#777777',
    border: '#e0e0e0',
    success: '#27ae60',
    danger: '#e74c3c',
  },
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '20px',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: '4px',
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

export default customTheme;