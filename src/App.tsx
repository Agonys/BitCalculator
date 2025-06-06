import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { checkItemDataDuplicates } from './lib/checkItemDataDuplicates';
import { Editor, Main } from './pages';

export const App = () => {
  useEffect(() => {
    if (checkItemDataDuplicates()) {
      throw new Error('some duplicates found in constants');
    }
  }, []);

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
