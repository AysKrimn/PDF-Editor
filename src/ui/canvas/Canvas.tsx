import { useCallback } from 'react';
import { useEditor, useEditorState } from '../hooks/useEditor';
import { TextRenderer } from './TextRenderer';
import { ImageRenderer } from './ImageRenderer';
import { isTextObject } from '../../editor/objects/TextObject';
import { isImageObject } from '../../editor/objects/ImageObject';
import type { EditorObject } from '../../shared/types';
import { A4_WIDTH, A4_HEIGHT } from '../../shared/constants';

interface CanvasProps {
  editingId: string | null;
  onStartEditing: (id: string) => void;
  onStopEditing: () => void;
}

export function Canvas({ editingId, onStartEditing, onStopEditing }: CanvasProps) {
  const editor = useEditor();
  const state = useEditorState();

  const handleCanvasClick = useCallback(() => {
    editor.select(null);
  }, [editor]);

  const handleSelect = useCallback((id: string) => {
    editor.select(id);
  }, [editor]);

  const handleUpdate = useCallback((id: string, updates: Partial<EditorObject>) => {
    editor.updateObject(id, updates);
  }, [editor]);

  const handleDelete = useCallback((id: string) => {
    editor.removeObject(id);
  }, [editor]);

  return (
    <div
      className="relative bg-white shadow-xl"
      style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
      onClick={handleCanvasClick}
    >
      {state.objects.map((obj) => {
        if (isTextObject(obj)) {
          return (
            <TextRenderer
              key={obj.id}
              object={obj}
              isSelected={state.selectedId === obj.id}
              isEditing={editingId === obj.id}
              onSelect={handleSelect}
              onStartEditing={onStartEditing}
              onStopEditing={onStopEditing}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          );
        }
        if (isImageObject(obj)) {
          return (
            <ImageRenderer
              key={obj.id}
              object={obj}
              isSelected={state.selectedId === obj.id}
              onSelect={handleSelect}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
