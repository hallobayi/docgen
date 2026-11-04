import { describe, expect, test } from "bun:test";
import { computeTotals } from "../src/lib/calc";
import { defaultData, withDataDefaults } from "../src/lib/storage";
import { formatSignedRupiah, terbilang } from "../src/lib/format";

describe("document adjustments", () => {
  test("applies signed amounts after discount and tax", () => {
    const data = defaultData();
    data.showDiscount = true;
    data.discount = 2564;
    data.taxPercent = 10;
    data.adjustments = [
      { id: "pph", label: "Potongan PPh 21 (PPh Pasal 21)", amount: -2000, enabled: true },
      { id: "fee", label: "Biaya tambahan", amount: 1000, enabled: true },
    ];
    const totals = computeTotals(data);
    expect(totals.subtotal).toBe(100000);
    expect(totals.discount).toBe(2564);
    expect(totals.taxAmount).toBeCloseTo(9743.6);
    expect(totals.adjustmentAmount).toBe(-1000);
    expect(totals.total).toBeCloseTo(106179.6);
  });

  test("disabled options retain their values without affecting the total", () => {
    const data = defaultData();
    data.discount = 2564;
    data.showTax = false;
    data.adjustments = [{ id: "pph", label: "PPh 21", amount: -2000, enabled: false }];
    expect(computeTotals(data).total).toBe(100000);
    data.showDiscount = true;
    data.showTax = true;
    data.adjustments = data.adjustments.map((row) => ({ ...row, enabled: true }));
    expect(computeTotals(data).total).toBeCloseTo(106153.96);
    expect(data.discount).toBe(2564);
  });

  test("removing a row and editing its sign changes the total", () => {
    const data = defaultData();
    data.showTax = false;
    data.adjustments = [{ id: "custom", label: "Custom", amount: -2000, enabled: true }];
    expect(computeTotals(data).total).toBe(98000);
    data.adjustments = data.adjustments.map((row) => ({ ...row, amount: 1000 }));
    expect(computeTotals(data).total).toBe(101000);
    data.adjustments = [];
    expect(computeTotals(data).total).toBe(100000);
  });

  test("formats both signs explicitly", () => {
    expect(formatSignedRupiah(-2000).replace(/\s/g, "")).toBe("-Rp2.000");
    expect(formatSignedRupiah(1000).replace(/\s/g, "")).toBe("+Rp1.000");
  });

  test("preserves negative totals and their sign in words", () => {
    const data = defaultData();
    data.showTax = false;
    data.adjustments = [{ id: "deduction", label: "Potongan", amount: -102000, enabled: true }];
    const total = computeTotals(data).total;
    expect(total).toBe(-2000);
    expect(terbilang(total)).toBe("Minus dua ribu rupiah");
    expect(terbilang(2000)).toBe("Dua ribu rupiah");
    expect(terbilang(0)).toBe("nol rupiah");
  });
});

describe("saved document compatibility", () => {
  test("older documents receive nullable PIC, plain text fallback, and empty adjustments", () => {
    const data = withDataDefaults({ notes: "Bayar < 7 hari\nTerima kasih" });
    expect(data.client.pic).toBeNull();
    expect(data.adjustments).toEqual([]);
    expect(data.notesHtml).toBeNull();
    expect(data.termsHtml).toBeNull();
    expect(data.notes).toBe("Bayar < 7 hari\nTerima kasih");
  });

  test("new fields survive saving and loading a snapshot", () => {
    const data = defaultData();
    data.client.pic = "Budi";
    data.adjustments = [{ id: "pph", label: "PPh 21", amount: -2000, enabled: true }];
    data.notes = "Terima kasih";
    data.notesHtml = "<p><strong>Terima kasih</strong></p>";
    const loaded = withDataDefaults(JSON.parse(JSON.stringify(data)));
    expect(loaded.client.pic).toBe("Budi");
    expect(loaded.adjustments).toEqual(data.adjustments);
    expect(loaded.notesHtml).toBe(data.notesHtml);
  });
});
