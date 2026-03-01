import { useCallback, useRef, useEffect, useState } from 'react';
import type { TextObjectData, EditorObject } from '../../shared/types';
import { Icon } from '../icons/Icon';

type DragMode =
  | 'move'
  | 'resize-se' | 'resize-sw' | 'resize-ne' | 'resize-nw'
  | 'resize-e' | 'resize-w' | 'resize-n' | 'resize-s'
  | null;

interface TextRendererProps {
  object: TextObjectData;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: string) => void;
  onStartEditing: (id: string) => void;
  onStopEditing: () => void;
  onUpdate: (id: string, updates: Partial<EditorObject>) => void;
  onDelete: (id: string) => void;
}

const MIN_W = 40;
const MIN_H = 24;

export function TextRenderer({
  object,
  isSelected,
  isEditing,
  onSelect,
  onStartEditing,
  onStopEditing,
  onUpdate,
  onDelete,
}: TextRendererProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragRef = useRef<{
    mode: DragMode;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);
  const [localText, setLocalText] = useState(object.text);

  useEffect(() => { setLocalText(object.text); }, [object.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, mode: DragMode) => {
      e.stopPropagation();
      e.preventDefault();
      if (!mode) return;

      onSelect(object.id);
      dragRef.current = {
        mode,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: object.x,
        startY: object.y,
        startW: object.width,
        startH: object.height,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startMouseX;
        const dy = ev.clientY - dragRef.current.startMouseY;
        const d = dragRef.current;

        if (d.mode === 'move') {
          onUpdate(object.id, { x: d.startX + dx, y: d.startY + dy });
        } else if (d.mode === 'resize-se') {
          onUpdate(object.id, { width: Math.max(MIN_W, d.startW + dx), height: Math.max(MIN_H, d.startH + dy) });
        } else if (d.mode === 'resize-sw') {
          const newW = Math.max(MIN_W, d.startW - dx);
          onUpdate(object.id, { x: d.startX + d.startW - newW, width: newW, height: Math.max(MIN_H, d.startH + dy) });
        } else if (d.mode === 'resize-ne') {
          const newH = Math.max(MIN_H, d.startH - dy);
          onUpdate(object.id, { y: d.startY + d.startH - newH, width: Math.max(MIN_W, d.startW + dx), height: newH });
        } else if (d.mode === 'resize-nw') {
          const newW = Math.max(MIN_W, d.startW - dx);
          const newH = Math.max(MIN_H, d.startH - dy);
          onUpdate(object.id, { x: d.startX + d.startW - newW, y: d.startY + d.startH - newH, width: newW, height: newH });
        } else if (d.mode === 'resize-e') {
          onUpdate(object.id, { width: Math.max(MIN_W, d.startW + dx) });
        } else if (d.mode === 'resize-w') {
          const newW = Math.max(MIN_W, d.startW - dx);
          onUpdate(object.id, { x: d.startX + d.startW - newW, width: newW });
        } else if (d.mode === 'resize-s') {
          onUpdate(object.id, { height: Math.max(MIN_H, d.startH + dy) });
        } else if (d.mode === 'resize-n') {
          const newH = Math.max(MIN_H, d.startH - dy);
          onUpdate(object.id, { y: d.startY + d.startH - newH, height: newH });
        }
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [object.id, object.x, object.y, object.width, object.height, onSelect, onUpdate],
  );

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(object.id);
  }, [object.id, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onStartEditing(object.id);
  }, [object.id, onStartEditing]);

  const handleTextBlur = useCallback(() => {
    onUpdate(object.id, { text: localText });
    onStopEditing();
  }, [object.id, localText, onUpdate, onStopEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onUpdate(object.id, { text: localText });
      onStopEditing();
    }
  }, [object.id, localText, onUpdate, onStopEditing]);

  const handleDeleteKey = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && isSelected && !isEditing) {
      e.preventDefault();
      onDelete(object.id);
    }
  }, [object.id, isSelected, isEditing, onDelete]);

  const borderColor = isEditing
    ? 'border-blue-500'
    : isSelected
      ? 'border-blue-400'
      : 'border-transparent hover:border-slate-300';

  const textStyle: React.CSSProperties = {
    fontFamily: object.fontFamily,
    fontSize: `${object.fontSize}px`,
    fontWeight: object.fontWeight,
    fontStyle: object.fontStyle,
    textAlign: object.textAlign,
    color: object.color,
    lineHeight: 1.3,
  };

  return (
    <div
      className={`absolute border-2 ${borderColor} transition-colors group`}
      style={{ left: object.x, top: object.y, width: object.width, height: object.height, zIndex: object.zIndex }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleDeleteKey}
      tabIndex={0}
    >
      <div className="absolute inset-0 cursor-move" onMouseDown={(e) => handleMouseDown(e, 'move')} />

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full bg-white/80 border-0 outline-none resize-none p-1"
          style={textStyle}
        />
      ) : (
        <div
          className="absolute inset-0 overflow-hidden p-1 select-none pointer-events-none whitespace-pre-wrap wrap-break-word"
          style={textStyle}
        >
          {object.text}
        </div>
      )}

      {isSelected && !isEditing && (
        <>
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-nw')} />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-ne')} />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-sw')} />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-se')} />

          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-blue-500 rounded-full cursor-n-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-n')} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-blue-500 rounded-full cursor-s-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-s')} />
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-6 bg-blue-500 rounded-full cursor-w-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-w')} />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-6 bg-blue-500 rounded-full cursor-e-resize" onMouseDown={(e) => handleMouseDown(e, 'resize-e')} />

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(object.id); }}
            className="absolute -top-8 right-0 flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md shadow-sm transition-colors"
          >
            <Icon name="trash2" className='cursor-pointer' />
          </button>
        </>
      )}
    </div>
  );
}
