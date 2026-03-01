import { useState, useCallback } from 'react';
import { HomeView } from './ui/views/HomeView';
import { EditorView } from './ui/views/EditorView';

type AppMode = { view: 'home' } | { view: 'editor' };

export default function App() {
  const [mode, setMode] = useState<AppMode>({ view: 'home' });

  const handleCreateNew = useCallback(() => {
    setMode({ view: 'editor' });
  }, []);

  const handleGoHome = useCallback(() => {
    setMode({ view: 'home' });
  }, []);

  if (mode.view === 'editor') {
    return <EditorView onGoHome={handleGoHome} />;
  }

  return <HomeView onCreateNew={handleCreateNew} />;
}
