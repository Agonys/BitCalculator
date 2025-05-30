import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';
import { ItemsProvider } from './contexts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ItemsProvider>
      <App />
    </ItemsProvider>
  </BrowserRouter>,
);
