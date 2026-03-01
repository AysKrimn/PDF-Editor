import { useCallback } from 'react';
import { useEditor, useEditorState } from '../hooks/useEditor';
import { isTextObject } from '../../editor/objects/TextObject';
import { isImageObject } from '../../editor/objects/ImageObject';
import type { EditorObject } from '../../shared/types';
import { PositionFields } from './PositionFields';
import { OrderActions } from './OrderActions';
import { TextInspector } from './TextInspector';
import { ImageInspector } from './ImageInspector';

export function Inspector() {
  const editor = useEditor();
  const state = useEditorState();

  const selected = state.objects.find((o) => o.id === state.selectedId) ?? null;

  const handleUpdate = useCallback(
    (updates: Partial<EditorObject>) => {
      if (!selected) return;
      editor.updateObject(selected.id, updates);
    },
    [editor, selected],
  );

  const handleBringToFront = useCallback(() => {
    if (selected) editor.bringToFront(selected.id);
  }, [editor, selected]);

  const handleSendToBack = useCallback(() => {
    if (selected) editor.sendToBack(selected.id);
  }, [editor, selected]);

  if (!selected) {
    return (
      <div className="p-4 text-sm text-slate-400 italic">
        Bir nesne secin
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <p className='mb-1'> <small>ID: {selected.id}</small></p>
      <hr />

      <div className="space-y-2 p-5 mb-3">
        <PositionFields object={selected} onUpdate={handleUpdate} />
        <OrderActions onBringToFront={handleBringToFront} onSendToBack={handleSendToBack} />

        {isTextObject(selected) && (
          <TextInspector object={selected} onUpdate={handleUpdate} />
        )}
        {isImageObject(selected) && (
          <ImageInspector object={selected} onUpdate={handleUpdate} />
        )}
      </div>

    </div>
  );
}
