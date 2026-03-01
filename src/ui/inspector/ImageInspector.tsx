import type { ImageObjectData, EditorObject, ObjectFit } from '../../shared/types';

interface ImageInspectorProps {
  object: ImageObjectData;
  onUpdate: (updates: Partial<EditorObject>) => void;
}

const FIT_OPTIONS: { label: string; value: ObjectFit }[] = [
  { label: 'Contain', value: 'contain' },
  { label: 'Cover', value: 'cover' },
  { label: 'Fill', value: 'fill' },
];

export function ImageInspector({ object, onUpdate }: ImageInspectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gorsel Ozellikleri</h4>

      <label className="block text-xs text-slate-600">
        Opaklık
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={object.opacity}
          onChange={(e) => onUpdate({ opacity: Number(e.target.value) })}
          className="mt-1 w-full"
        />
        <span className="text-[11px] text-slate-400">{Math.round(object.opacity * 100)}%</span>
      </label>

      <label className="block text-xs text-slate-600">
        Object Fit
        <select
          value={object.objectFit}
          onChange={(e) => onUpdate({ objectFit: e.target.value as ObjectFit })}
          className="mt-0.5 w-full px-2 py-1.5 text-sm border border-slate-200 rounded"
        >
          {FIT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
