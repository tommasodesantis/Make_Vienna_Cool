import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const rawPreferences = window.localStorage.getItem('make-vienna-cool.preferences.v1');
  const storedTheme = rawPreferences ? JSON.parse(rawPreferences).theme : null;
  const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  document.documentElement.style.colorScheme = initialTheme;
} catch {
  document.documentElement.classList.remove('dark');
  document.documentElement.style.colorScheme = 'light';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
