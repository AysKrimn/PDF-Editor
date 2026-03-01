import { useCallback, useRef } from 'react';
import type { ImageObjectData, EditorObject } from '../../shared/types';
import { Icon } from '../icons/Icon';

type DragMode =
  | 'move'
  | 'resize-se' | 'resize-sw' | 'resize-ne' | 'resize-nw'
  | 'resize-e' | 'resize-w' | 'resize-n' | 'resize-s'
  | null;

interface ImageRendererProps {
  object: ImageObjectData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EditorObject>) => void;
  onDelete: (id: string) => void;
}

const MIN_W = 20;
const MIN_H = 20;

export function ImageRenderer({
  object,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: ImageRendererProps) {
  const dragRef = useRef<{
    mode: DragMode;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

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

  const handleDeleteKey = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && isSelected) {
      e.preventDefault();
      onDelete(object.id);
    }
  }, [object.id, isSelected, onDelete]);

  const borderColor = isSelected
    ? 'border-blue-400'
    : 'border-transparent hover:border-slate-300';    

  
  const selectedResizeClass = {
    nw: "absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize",
    ne: "absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize",
    sw: "absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize",
    se: "absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"
  }

  return (
    <div
      className={`absolute border-2 ${borderColor} transition-colors group`}
      style={{ left: object.x, top: object.y, width: object.width, height: object.height, zIndex: object.zIndex }}
      onClick={handleClick}
      onKeyDown={handleDeleteKey}
      tabIndex={0}
    >
      <div className="absolute inset-0 cursor-move" onMouseDown={(e) => handleMouseDown(e, 'move')} />

      <img
        src={object.src}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ objectFit: object.objectFit, opacity: object.opacity }}
      />

      {isSelected && (
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
