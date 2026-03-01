interface PaletteItemProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function PaletteItem({ onClick, icon, title, description }: PaletteItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors palet-item"
      style={{ marginBottom: "4px", marginTop: "4px"}}
    >
      <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-lg shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-[11px] text-slate-400">{description}</p>
      </div>
    </button>
  );
}
