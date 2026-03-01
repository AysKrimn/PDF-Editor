import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor } from '../hooks/useEditor';
import { EditorProvider, useEditorInstance } from '../hooks/useEditor';
import { Canvas } from '../canvas/Canvas';
import { Toolbar } from '../toolbar/Toolbar';
import { Inspector } from '../inspector/Inspector';
import { Palette } from '../palette/Palette';

interface EditorViewInnerProps {
  onGoHome: () => void;
}

function EditorViewInner({ onGoHome }: EditorViewInnerProps) {
  const editor = useEditor();
  const [editingId, setEditingId] = useState<string | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleStartEditing = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleStopEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleGoHome = useCallback(() => {
    if (editor.isDirty) {
      const confirmed = window.confirm('Degisiklikler kaydedilmedi. Devam etmek istiyor musunuz?');
      if (!confirmed) return;
    }
    editor.reset();
    onGoHome();
  }, [editor, onGoHome]);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar onGoHome={handleGoHome} />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-56 border-r border-slate-200 bg-white overflow-y-auto shrink-0">
          <Palette canvasContainerRef={canvasContainerRef} />
        </div>

        <div ref={canvasContainerRef} className="flex-1 overflow-auto bg-slate-200 flex items-start justify-center p-8">
          <Canvas
            editingId={editingId}
            onStartEditing={handleStartEditing}
            onStopEditing={handleStopEditing}
          />
        </div>

        <div className="w-64 border-l border-slate-200 bg-white overflow-y-auto shrink-0">
          <Inspector />
        </div>
      </div>
    </div>
  );
}

interface EditorViewProps {
  onGoHome: () => void;
}

export function EditorView({ onGoHome }: EditorViewProps) {
  const { editor, destroy } = useEditorInstance();

  useEffect(() => {
    return () => destroy();
  }, [destroy]);

  return (
    <EditorProvider value={editor}>
      <EditorViewInner onGoHome={onGoHome} />
    </EditorProvider>
  );
}
