import type { EditorObject } from '../../shared/types';

interface PositionFieldsProps {
  object: EditorObject;
  onUpdate: (updates: Partial<EditorObject>) => void;
}

export function PositionFields({ object, onUpdate }: PositionFieldsProps) {
  return (
   <>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Konum & Boyut</h4>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-600">
          X
          <input
            type="number"
            value={Math.round(object.x)}
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            className="mt-0.5 w-full px-2 py-1 text-sm border border-slate-200 rounded"
          />
        </label>
        <label className="text-xs text-slate-600">
          Y
          <input
            type="number"
            value={Math.round(object.y)}
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            className="mt-0.5 w-full px-2 py-1 text-sm border border-slate-200 rounded"
          />
        </label>
        <label className="text-xs text-slate-600">
          Genislik
          <input
            type="number"
            value={Math.round(object.width)}
            onChange={(e) => onUpdate({ width: Number(e.target.value) })}
            className="mt-0.5 w-full px-2 py-1 text-sm border border-slate-200 rounded"
          />
        </label>
        <label className="text-xs text-slate-600">
          Yukseklik
          <input
            type="number"
            value={Math.round(object.height)}
            onChange={(e) => onUpdate({ height: Number(e.target.value) })}
            className="mt-0.5 w-full px-2 py-1 text-sm border border-slate-200 rounded"
          />
        </label>
      </div>  

    </>
  );
}
