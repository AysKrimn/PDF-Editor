import { FileText, FilePlus } from 'lucide-react';

interface HomeViewProps {
  onCreateNew: () => void;
}

export function HomeView({ onCreateNew }: HomeViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 mb-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">PDF Editor</h1>
          <p className="text-slate-500">PDF olusturun veya duzenleyin</p>
        </div>

        <div className="space-y-3 flex gap-3 mt-1">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center gap-4 p-5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl shadow-sm transition-all group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl transition-colors">
              <FilePlus className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-800">Sıfırdan Oluştur</p>
              <p className="text-sm text-slate-500">Boş bir sayfa ile başlayın</p>
            </div>
          </button>

          <button
            disabled
            className="w-full flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm opacity-50 cursor-not-allowed"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-400">PDF Düzenle</p>
              <p className="text-sm text-slate-400">Yakında...</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
