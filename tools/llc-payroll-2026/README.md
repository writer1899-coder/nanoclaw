# Owner Pay Planner 2026

A payroll-style planner for an LLC owner who pays themselves with **owner draws** (no W-2 salary), files **married filing jointly**, and pays **quarterly estimated tax** (Form 1040-ES) for tax year **2026**.

Open `index.html` in a browser. There's no build step and no dependencies. Your inputs are saved in that browser's local storage.

## What it calculates

- **Self-employment tax** (Schedule SE): 15.3% on 92.35% of profit. Social Security stops at the 2026 wage base of $184,500. The 0.9% additional Medicare tax uses the $250,000 MFJ threshold shared with W-2 wages. Each spouse is calculated separately when both own the LLC.
- **Income tax** on the joint return: 2026 MFJ brackets, the $32,200 standard deduction or itemized deductions (SALT cap $40,400, phased down above $505,000), the senior deduction, the QBI deduction (§199A, threshold $403,500 with a $150,000 phase-in and a $400 minimum), qualified dividend and capital gain rates, the $2,200 child tax credit and the 3.8% NIIT.
- **Quarterly payments**: safe harbor (the smaller of 90% of 2026 tax or 100%/110% of 2025 tax) or pay in full. It shows each quarter's status, a catch-up amount for quarters paid short, and an estimated underpayment penalty.
- **Owner draw register**: profit per pay date (weekly, biweekly, semimonthly, monthly or quarterly), with federal and state set-asides, health and retirement contributions, take-home draw, and a running tax-reserve balance against each 1040-ES payment.
- **Tax caused by the LLC**: household tax with the LLC minus household tax without it.

## Files

| File | Purpose |
|------|---------|
| `tax2026.js` | Tax engine with no DOM code. Sets `globalThis.LLCTax2026`. |
| `index.html` | Calculator UI |
| `tax2026.test.js` | Engine tests: `node --test tools/llc-payroll-2026/tax2026.test.js` |

## Not modeled

AMT, the itemized-deduction limit for the 37% bracket, the annualized-income installment method (Form 2210 Schedule AI), passive-activity rules, and state-specific rules (state tax is a flat % of LLC profit). This is a planning estimate, not tax advice.
