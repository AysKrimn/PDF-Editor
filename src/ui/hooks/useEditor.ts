import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { EditorState } from '../../editor/EditorState';
import { Editor } from '../../editor/Editor';

const EditorContext = createContext<Editor | null>(null);

export const EditorProvider = EditorContext.Provider;

export function useEditor(): Editor {
  const editor = useContext(EditorContext);
  if (!editor) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return editor;
}

export function useEditorState(): EditorState {
  const editor = useEditor();
  const [state, setState] = useState<EditorState>(editor.state);

  useEffect(() => {
    const unsub = editor.events.on('state:changed', (s) => {
      setState({ ...s, objects: [...s.objects] });
    });
    return unsub;
  }, [editor]);

  return state;
}

export function useEditorHistory(): { canUndo: boolean; canRedo: boolean } {
  const editor = useEditor();
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    const unsub = editor.events.on('history:changed', setHistory);
    return unsub;
  }, [editor]);

  return history;
}

export function useEditorInstance(): { editor: Editor; destroy: () => void } {
  const [editor] = useState(() => new Editor());

  const destroy = useCallback(() => {
    editor.events.clear();
  }, [editor]);

  return { editor, destroy };
}
