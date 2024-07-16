import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import styled from 'styled-components';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: number;
}

type ToggleTodo = (id: number) => void;
type RemoveTodo = (id: number) => void;
type MoveTodo = (id: number, direction: 'up' | 'down') => void;

const AppContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.large};
  font-family: Arial, sans-serif;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Input = styled.input`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius} 0 0 ${({ theme }) => theme.borderRadius};
`;

const AddButton = styled.button`
  padding: ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: 0 ${({ theme }) => theme.borderRadius} ${({ theme }) => theme.borderRadius} 0;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
  }
`;

const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TodoItem = styled.li<{ completed: boolean; priority: number }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${(props) => {
    if (props.completed) return props.theme.colors.border;
    switch (props.priority) {
      case 1: return '#ffcccc'; // Light red for high priority
      case 2: return '#ffffcc'; // Light yellow for medium priority
      default: return props.theme.colors.background;
    }
  }};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  transition: background-color 0.3s;
`;

const TodoText = styled.span<{ completed: boolean }>`
  flex-grow: 1;
  text-decoration: ${(props) => props.completed ? 'line-through' : 'none'};
  color: ${(props) => props.completed ? props.theme.colors.lightText : props.theme.colors.text};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

const IconButton = styled.button`
  padding: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.fontSizes.small};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RemoveButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.danger};
`;

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (): void => {
    if (newTodo.trim() !== '') {
      setTodos((prevTodos: Todo[]): Todo[] => [
        ...prevTodos,
        { id: Date.now(), text: newTodo, completed: false, priority: 0 }
      ]);
      setNewTodo('');
    }
  };
  
  const toggleTodo: ToggleTodo = (id) => {
    setTodos((prevTodos: Todo[]): Todo[] =>
      prevTodos.map((todo: Todo): Todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo: RemoveTodo = (id) => {
    setTodos((prevTodos: Todo[]): Todo[] =>
      prevTodos.filter((todo: Todo): boolean => todo.id !== id)
    );
  };

  const moveTodo: MoveTodo = (id, direction) => {
    setTodos((prevTodos: Todo[]): Todo[] => {
      const index = prevTodos.findIndex(todo => todo.id === id);
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prevTodos.length - 1)) {
        return prevTodos;
      }
      const newTodos = [...prevTodos];
      const [removed] = newTodos.splice(index, 1);
      newTodos.splice(direction === 'up' ? index - 1 : index + 1, 0, removed);
      return newTodos;
    });
  };

  const togglePriority = (id: number): void => {
    setTodos((prevTodos: Todo[]): Todo[] =>
      prevTodos.map((todo: Todo): Todo =>
        todo.id === id ? { ...todo, priority: (todo.priority + 1) % 3 } : todo
      )
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTodo(e.target.value);
  };

  const handleAddClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    addTodo();
  };

  return (
    <AppContainer>
      <Title>To-Do List</Title>
      <InputContainer>
        <Input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Add a new todo"
        />
        <AddButton onClick={handleAddClick}>Add</AddButton>
      </InputContainer>
      <TodoList>
        {todos.map((todo: Todo, index: number) => (
          <TodoItem key={todo.id} completed={todo.completed} priority={todo.priority}>
            <TodoText 
              completed={todo.completed}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </TodoText>
            <ButtonGroup>
              <IconButton onClick={() => togglePriority(todo.id)} title="Toggle Priority">
                {['⚪', '🔴', '🟡'][todo.priority]}
              </IconButton>
              <IconButton onClick={() => moveTodo(todo.id, 'up')} disabled={index === 0} title="Move Up">
                ▲
              </IconButton>
              <IconButton onClick={() => moveTodo(todo.id, 'down')} disabled={index === todos.length - 1} title="Move Down">
                ▼
              </IconButton>
              <RemoveButton onClick={() => removeTodo(todo.id)} title="Remove">
                ✖
              </RemoveButton>
            </ButtonGroup>
          </TodoItem>
        ))}
      </TodoList>
    </AppContainer>
  );
};

export default TodoApp;