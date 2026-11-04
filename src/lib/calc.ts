import type { DocType, DocumentData, LineItem, PayrollData } from "../types";

/** True for the salary invoice, which uses payroll fields instead of items. */
export function isPayroll(docType: DocType): boolean {
  return docType === "invoice-gaji";
}

export function lineTotal(item: LineItem): number {
  return (Number(item.qty) || 0) * (Number(item.price) || 0);
}

export interface PayrollTotals {
  total: number; // sum of every line amount
}

export function computePayroll(p: PayrollData): PayrollTotals {
  const total = (p.lines ?? []).reduce(
    (sum, l) => sum + (Number(l.amount) || 0),
    0,
  );
  return { total };
}

export interface Totals {
  subtotal: number;
  taxAmount: number;
  discount: number;
  adjustmentAmount: number;
  total: number;
}

export function computeTotals(data: DocumentData): Totals {
  const subtotal = data.items.reduce((sum, it) => sum + lineTotal(it), 0);
  const discount = data.showDiscount ? Number(data.discount) || 0 : 0;
  const base = Math.max(subtotal - discount, 0);
  const taxAmount = data.showTax
    ? (base * (Number(data.taxPercent) || 0)) / 100
    : 0;
  const adjustmentAmount = data.adjustments.reduce(
    (sum, adjustment) =>
      sum + (adjustment.enabled ? Number(adjustment.amount) || 0 : 0),
    0,
  );
  const total = base + taxAmount + adjustmentAmount;
  return { subtotal, taxAmount, discount, adjustmentAmount, total };
}
