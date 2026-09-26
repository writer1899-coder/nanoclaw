// Run with: node --test tools/llc-payroll-2026/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import './tax2026.js';

const T = globalThis.LLCTax2026;
const near = (actual, expected, tol = 0.01) =>
  assert.ok(Math.abs(actual - expected) <= tol, `expected ${expected}, got ${actual}`);

test('ordinary brackets match Rev. Proc. 2025-32 (MFJ)', () => {
  near(T.ordinaryTax(24800), 2480);
  near(T.ordinaryTax(100800), 2480 + 76000 * 0.12);
  near(T.ordinaryTax(800000), 2480 + 9120 + 24332 + 46116 + 34848 + 89687.5 + 31300 * 0.37);
});

test('$120k LLC profit, no other income', () => {
  const r = T.computeTax({ revenue: 150000, expenses: 30000 });
  near(r.se.you.netEarnings, 110820);
  near(r.seTax, 16955.46);
  near(r.agi, 111522.27);
  near(r.taxableBeforeQbi, 79322.27);
  // 20% of QBI is 22,304.45 but the taxable-income cap binds
  near(r.qbiDeduction, 15864.45);
  near(r.taxableIncome, 63457.82);
  near(r.incomeTax, 7118.94);
  near(r.totalTax, 24074.4);
});

test('social security portion stops at the $184,500 wage base', () => {
  const se = T.scheduleSE(250000, 0);
  near(se.socialSecurity, 184500 * 0.124);
  near(se.medicare, 250000 * 0.9235 * 0.029);
  // Owner W-2 wages use up the wage base first
  near(T.scheduleSE(100000, 184500).socialSecurity, 0);
});

test('SE tax does not apply under $400 of net earnings', () => {
  assert.equal(T.scheduleSE(400, 0).total, 0);
  assert.ok(T.scheduleSE(500, 0).total > 0);
});

test('additional Medicare shares the $250k MFJ threshold with spouse wages', () => {
  const r = T.computeTax({ revenue: 200000, spouseW2Wages: 200000 });
  // 184,700 net SE earnings, only 50,000 of threshold left after wages
  near(r.additionalMedicare, (200000 * 0.9235 - 50000) * 0.009);
});

test('qualified dividends and long-term gains use the 0/15/20 breakpoints', () => {
  const t = T.taxWithPreferential(120000, 30000);
  // 90,000 ordinary; 8,900 at 0%; 21,100 at 15%
  near(t.at0, 8900);
  near(t.at15, 21100);
  near(t.tax, T.ordinaryTax(90000) + 21100 * 0.15);
});

test('QBI deduction phases out for a service business above $403,500', () => {
  const base = { revenue: 700000, sstb: true };
  const r = T.computeTax(base);
  assert.ok(r.taxableBeforeQbi > 403500 + 150000);
  assert.equal(r.qbiDeduction, 0);
  const nonService = T.computeTax({ ...base, sstb: false, llcW2WagesPaid: 100000 });
  near(nonService.qbiDeduction, Math.min(0.2 * nonService.qbi, 50000));
});

test('safe harbor uses 110% of prior-year tax when 2025 AGI was over $150k', () => {
  const r = T.computeTax({ revenue: 300000, federalWithholding: 10000 });
  const plan = T.planEstimates({ ...r, input: { ...r.input, priorYearTax: 40000, priorYearAgi: 200000 } });
  near(plan.priorYearSafeHarbor, 44000);
  near(plan.requiredAnnual, Math.min(44000, 0.9 * r.totalTax));
  near(plan.estimatesNeeded, plan.requiredAnnual - 10000);
});

test('catch-up after missed quarters, one quarter left', () => {
  const out = T.run({
    revenue: 150000,
    expenses: 30000,
    priorYearTax: 100000,
    estimatedPaid: [5000, 0, 0, 0],
    asOf: '2026-09-26',
  });
  const p = out.plan;
  const q = p.estimatesNeeded / 4;
  near(p.catchUpNow, 3 * q - 5000);
  near(p.quarters[3].recommended, q);
  near(p.paidTotal + p.catchUpNow + p.quarters[3].recommended, p.estimatesNeeded);
  assert.ok(p.penaltyIfNoMorePayments > p.penaltyIfFollowPlan);
  assert.ok(p.penaltyIfFollowPlan > 0);
});

test('paying every quarter on time means no penalty', () => {
  const first = T.run({ revenue: 150000, expenses: 30000, asOf: '2026-01-01' });
  const q = first.plan.perQuarter;
  const out = T.run({ revenue: 150000, expenses: 30000, estimatedPaid: [q, q, q, q], asOf: '2027-02-01' });
  near(out.plan.penaltyIfFollowPlan, 0);
  near(out.plan.remaining, 0);
});

test('draw register reserves tax and reconciles to the annual profit', () => {
  const out = T.run({ revenue: 150000, expenses: 30000, statePct: 5, drawFrequency: 'biweekly' });
  const d = out.draws;
  assert.equal(d.periods, 26);
  near(d.annual.draw + d.annual.federal + d.annual.state + d.annual.contributions, d.annual.profit);
  near(d.annual.state, 6000);
  const last = d.rows[d.rows.length - 1];
  assert.equal(last.kind, 'estimate');
  // Federal reserve covers everything withholding does not; after Q4 what remains is the April balance
  near(last.reserveBalance, d.annual.federal - out.plan.estimatesNeeded);
});

test('tax caused by the LLC excludes tax the household owes anyway', () => {
  const out = T.run({ revenue: 100000, spouseW2Wages: 90000, federalWithholding: 6000 });
  const noLlc = T.computeTax({ spouseW2Wages: 90000 });
  near(out.llcAttributableTax, out.result.totalTax - noLlc.totalTax);
  assert.ok(out.llcEffectiveRate > 0.2 && out.llcEffectiveRate < 0.4);
});
