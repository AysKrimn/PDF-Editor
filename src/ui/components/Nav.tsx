import { useCallback, useState } from "react";
import { useEditor, useEditorState, useEditorHistory } from "../hooks/useEditor";
import { exportToPdf, downloadPdf } from "../../editor/export/PdfExporter";
import { A4_WIDTH, A4_HEIGHT } from "../../shared/constants";
import { Icon } from "../icons/Icon";

export function Nav({ onGoHome }: { onGoHome: () => void }) { 
    const editor = useEditor();
    const state = useEditorState();
    const history = useEditorHistory();
    const [exporting, setExporting] = useState(false);

    const handleExport = useCallback(async () => {
        setExporting(true);
        try {
            const bytes = await exportToPdf(state.objects, A4_WIDTH, A4_HEIGHT);
            downloadPdf(new Uint8Array(bytes), `${state.fileName || 'belge'}.pdf`);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    }, [state.objects, state.fileName]);


    return (
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white">
        <button
          onClick={onGoHome}
          style={{ paddingLeft: "5px"}}
          className="cursor-pointer text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          PDF Editor
        </button>
  
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={state.fileName}
            onChange={(e) => editor.setFileName(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-48"
            placeholder="Dosya adi..."
          />
        </div>
  
        <div className="flex items-center gap-2">
          <button
            onClick={() => editor.undo()}
            disabled={!history.canUndo}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Geri Al"
          >
            <Icon name="undo2" />
          </button>
          <button
            onClick={() => editor.redo()}
            disabled={!history.canRedo}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Yinele"
          >
            <Icon name="redo2" />
          </button>
  
          <div className="w-px h-6 bg-slate-200" />
  
          <button
            onClick={handleExport}
            disabled={exporting || state.objects.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? <Icon name="loader2" className="animate-spin" /> : <Icon name="download" />}
            Indir
          </button>
        </div>
      </div>
    )
}