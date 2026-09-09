# NC LLC Tax Worksheet

A standalone, offline HTML calculator for estimating quarterly tax payments on
LLC/self-employment profit. Not part of the NanoClaw runtime — open
`index.html` directly in a browser.

Covers, for a North Carolina resident filing married filing jointly:

- **Self-employment tax** (Schedule SE): Social Security (12.4% up to the
  annual wage base) + Medicare (2.9%, uncapped) + Additional Medicare Tax
  (0.9% above $250,000 joint), accounting for other W-2 wages that share the
  Social Security wage base and the Additional Medicare Tax threshold.
- **Federal income tax**: AGI after the deductible half of SE tax, the 20%
  qualified business income (QBI) deduction, the standard deduction, and the
  2025/2026 married-filing-jointly brackets.
- **North Carolina income tax**: NC's flat rate applied to federal AGI (NC
  does not conform to the federal QBI deduction) less the NC standard
  deduction.

Supports tax years 2025 (finalized IRS/NCDOR figures) and 2026 (preliminary
post-OBBBA inflation-adjusted figures — confirm against final IRS tables
before filing).

This is a planning estimate, not a substitute for a CPA — see the in-app
notes for the simplifying assumptions (standard deduction only, one
QBI-eligible non-SSTB business, no other income or credits).
