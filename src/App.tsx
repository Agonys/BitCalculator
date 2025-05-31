import { Route, Routes } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { Editor, Main } from './pages';

export const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/editor" element={<Editor />} />
        </Route>
      </Routes>
    </div>
  );
};
