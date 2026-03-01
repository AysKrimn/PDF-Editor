import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import type { TextObjectData, EditorObject, TextAlign } from '../../shared/types';
import { FONT_OPTIONS } from '../../shared/utils';


interface TextInspectorProps {
  object: TextObjectData;
  onUpdate: (updates: Partial<EditorObject>) => void;
}

export function TextInspector({ object, onUpdate }: TextInspectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Yazi Ozellikleri</h4>

      <label className="block text-xs text-slate-600">
        Font
        <select
          value={object.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          className="mt-0.5 w-full px-2 py-1.5 text-sm border border-slate-200 rounded"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-600">
          Punto
          <input
            type="number"
            min={8}
            max={200}
            value={object.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
            className="mt-0.5 w-full px-2 py-1 text-sm border border-slate-200 rounded"
          />
        </label>
        <label className="text-xs text-slate-600">
          Renk
          <input
            type="color"
            value={object.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="mt-0.5 w-full h-[30px] border border-slate-200 rounded cursor-pointer"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onUpdate({ fontWeight: object.fontWeight === 'bold' ? 'normal' : 'bold' })}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${object.fontWeight === 'bold' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          B
        </button>
        <button
          onClick={() => onUpdate({ fontStyle: object.fontStyle === 'italic' ? 'normal' : 'italic' })}
          className={`flex-1 py-1.5 text-xs italic rounded-lg transition-colors ${object.fontStyle === 'italic' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          I
        </button>
      </div>

      <div>
        <span className="text-xs text-slate-600">Hizalama</span>
        <div className="flex gap-1 mt-1">
          {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(
            ([align, Icon]) => (
              <button
                key={align}
                onClick={() => onUpdate({ textAlign: align as TextAlign })}
                className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-colors ${object.textAlign === align ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
