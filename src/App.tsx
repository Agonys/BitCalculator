import { Route, Routes } from 'react-router';
import { SidebarLayout } from './layouts/SidebarLayout';
import { Editor, Main } from './pages';

export const App = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Routes>
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/editor" element={<Editor />} />
        </Route>
      </Routes>
    </div>
  );
};
