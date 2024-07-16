import React from 'react';
import { ThemeProvider } from 'styled-components';
import TodoApp from './TodoApp';
import customTheme from './theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <TodoApp />
    </ThemeProvider>
  );
};

export default App;