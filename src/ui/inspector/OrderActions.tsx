import { Icon } from '../icons/Icon';

interface OrderActionsProps {
  onBringToFront: () => void;
  onSendToBack: () => void;
}

export function OrderActions({ onBringToFront, onSendToBack }: OrderActionsProps) {
  return (
    <>
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Siralama</h4>
      <div className="flex gap-2">
        <button
          onClick={onBringToFront}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Icon name="arrowUpToLine" className="w-3.5 h-3.5" />
          One Getir
        </button>
        <button
          onClick={onSendToBack}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Icon name="arrowDownToLine" className="w-3.5 h-3.5" />
          Arkaya Gonder
        </button>
      </div>
    </>
  );
}
