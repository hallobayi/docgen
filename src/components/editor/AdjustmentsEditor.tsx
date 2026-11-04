import { Plus, Trash } from "@phosphor-icons/react";
import type { Adjustment } from "../../types";
import { uid } from "../../lib/storage";
import { Button, Input } from "../ui";

interface Props {
  readonly adjustments: Adjustment[];
  readonly onChange: (adjustments: Adjustment[]) => void;
}

export function AdjustmentsEditor({ adjustments, onChange }: Props) {
  function patch(id: string, values: Partial<Adjustment>) {
    onChange(adjustments.map((row) => row.id === id ? { ...row, ...values } : row));
  }

  return (
    <div className="space-y-3 border-t border-border pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">Penyesuaian custom</span>
        <Button variant="outline" className="min-h-11 sm:min-h-0" onClick={() => onChange([...adjustments, { id: uid(), label: "", amount: 0, enabled: true }])}>
          <Plus size={14} weight="bold" /> Tambah penyesuaian
        </Button>
      </div>
      <p className="text-xs leading-relaxed text-slate-600">
        Dihitung setelah diskon dan pajak. Isi -2000 untuk potongan atau +1000 untuk tambahan.
      </p>
      {adjustments.map((row, index) => (
        <div key={row.id} className="space-y-2 rounded-lg border border-border bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 sm:min-h-0">
              <input type="checkbox" checked={row.enabled} onChange={(event) => patch(row.id, { enabled: event.target.checked })} className="h-4 w-4 cursor-pointer accent-primary" />
              Penyesuaian {index + 1} aktif
            </label>
            <Button variant="ghost" className="h-11 w-11 shrink-0 sm:h-8 sm:w-8" title={`Hapus penyesuaian ${index + 1}`} aria-label={`Hapus penyesuaian ${index + 1}`} onClick={() => onChange(adjustments.filter((item) => item.id !== row.id))}>
              <Trash size={16} className="shrink-0" />
            </Button>
          </div>
          <div>
            <label htmlFor={`adjustment-label-${row.id}`} className="mb-1 block text-xs font-semibold text-slate-500">Nama penyesuaian</label>
            <Input id={`adjustment-label-${row.id}`} value={row.label} placeholder="Mis. Potongan PPh 21 (PPh Pasal 21)" disabled={!row.enabled} onChange={(event) => patch(row.id, { label: event.target.value })} className="disabled:bg-muted disabled:opacity-50" />
          </div>
          <div>
            <label htmlFor={`adjustment-amount-${row.id}`} className="mb-1 block text-xs font-semibold text-slate-500">Nominal (Rp)</label>
            <Input
              id={`adjustment-amount-${row.id}`}
              type="text"
              inputMode="text"
              defaultValue={row.amount}
              disabled={!row.enabled}
              onChange={(event) => {
                const amount = Number(event.target.value);
                if (Number.isFinite(amount)) patch(row.id, { amount });
              }}
              onBlur={(event) => { event.target.value = String(row.amount); }}
              className="disabled:bg-muted disabled:opacity-50"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
