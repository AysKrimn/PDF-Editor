import { useCallback, useRef } from 'react';
import { useEditor } from '../hooks/useEditor';
import { PaletteItem } from './PaletteItem';
import { Icon } from '../icons/Icon';

interface PaletteProps {
  canvasContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function Palette({ canvasContainerRef }: PaletteProps) {
  const editor = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getViewportCenter = useCallback((): { x: number; y: number } => {
    const container = canvasContainerRef?.current;
    if (!container) return { x: 200, y: 300 };
    const scrollTop = container.scrollTop;
    const visibleHeight = container.clientHeight;
    return { x: 200, y: scrollTop + visibleHeight / 2 };
  }, [canvasContainerRef]);

  const handleAddText = useCallback(() => {
    const center = getViewportCenter();
    editor.addTextObject(center.x, center.y);
  }, [editor, getViewportCenter]);

  const handleAddList = useCallback(() => {
    const center = getViewportCenter();
    editor.addListObject(center.x, center.y);
  }, [editor, getViewportCenter]);

  const handleAddImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const center = getViewportCenter();
          editor.addImageObject(dataUrl, img.naturalWidth, img.naturalHeight, center.x, center.y);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);

      e.target.value = '';
    },
    [editor, getViewportCenter],
  );

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Bilesenler</h3>
      <PaletteItem
        onClick={handleAddText}
        icon={<Icon name="type" className="w-5 h-5 text-blue-600" />}
        title="Metin"
        description="Metin kutusu ekle"
      />
      <PaletteItem
        onClick={handleAddImage}
        icon={<Icon name="imageIcon" className="w-5 h-5 text-blue-600" />}
        title="Gorsel"
        description="Resim ekle"
      />

      <PaletteItem
        onClick={handleAddList}
        icon={<Icon name="listIcon" className="w-5 h-5 text-blue-600" />}
        title="Liste"
        description="Liste ekle"
      />


      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
