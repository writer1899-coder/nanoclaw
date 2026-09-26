/*
 * 2026 federal tax engine for an LLC owner paid through owner draws
 * (disregarded-entity / partnership LLC, no W-2 salary), married filing jointly,
 * paying quarterly estimated tax (Form 1040-ES).
 *
 * Classic script: attaches `LLCTax2026` to globalThis so it works from a
 * <script src> tag in the browser and from `import './tax2026.js'` in Node.
 *
 * Sources for the 2026 figures: Rev. Proc. 2025-32 (brackets, standard
 * deduction, capital-gain breakpoints, §199A threshold, SALT cap), the One Big
 * Beautiful Bill Act (P.L. 119-21) for the permanent QBI changes, senior
 * deduction, $2,200 child tax credit and non-itemizer charitable deduction,
 * SSA's 2026 contribution and benefit base, and IRS Notice 2025-67 for
 * retirement plan limits.
 */
(function () {
  'use strict';

  const TAX_YEAR = 2026;

  const C = Object.freeze({
    // Married filing jointly ordinary brackets: [upper bound, rate]
    brackets: [
      [24800, 0.1],
      [100800, 0.12],
      [211400, 0.22],
      [403550, 0.24],
      [512450, 0.32],
      [768700, 0.35],
      [Infinity, 0.37],
    ],
    // Qualified dividends / long-term capital gains breakpoints (MFJ)
    cg0Top: 98900,
    cg15Top: 613700,

    stdDeduction: 32200,
    addlStd65: 1650, // per spouse age 65+ (married)

    // Self-employment tax (Schedule SE)
    seFactor: 0.9235,
    seMinimum: 400,
    ssWageBase: 184500,
    ssRate: 0.124,
    medicareRate: 0.029,
    addlMedicareRate: 0.009,
    addlMedicareThreshold: 250000, // MFJ, not indexed

    niitRate: 0.038,
    niitThreshold: 250000, // MFJ, not indexed

    // Qualified business income deduction (Form 8995 / 8995-A)
    qbiRate: 0.2,
    qbiThreshold: 403500,
    qbiPhaseInRange: 150000, // MFJ, widened by OBBBA starting 2026
    qbiMinimumDeduction: 400,
    qbiMinimumActiveQbi: 1000,

    // Itemized deductions
    saltCap: 40400,
    saltFloor: 10000,
    saltPhaseoutStart: 505000,
    saltPhaseoutRate: 0.3,
    charityAgiFloor: 0.005, // itemizers only, starting 2026
    charityNonItemizer: 2000, // MFJ cash gifts, starting 2026

    // Senior deduction (2025-2028), per spouse age 65+
    seniorDeduction: 6000,
    seniorPhaseoutStart: 150000,
    seniorPhaseoutRate: 0.06,

    // Child tax credit / credit for other dependents
    ctcPerChild: 2200,
    ctcRefundablePerChild: 1700,
    odcPerDependent: 500,
    ctcPhaseoutStart: 400000,
    ctcEarnedFloor: 2500,
    ctcEarnedRate: 0.15,

    capitalLossLimit: 3000,

    // Estimated tax (Form 2210 safe harbors)
    safeHarborCurrentPct: 0.9,
    safeHarborHighAgi: 150000,
    safeHarborHighAgiPct: 1.1,
    penaltyFreeBalance: 1000,
    dueDates: ['2026-04-15', '2026-06-15', '2026-09-15', '2027-01-15'],
    filingDeadline: '2027-04-15',

    // Retirement / HSA limits (hints only)
    sepRateOfNetSe: 0.2,
    annualAdditionsLimit: 72000,
    electiveDeferralLimit: 24500,
    catchUp50: 8000,
    hsaFamilyLimit: 8750,
  });

  const num = (v) => {
    const n = typeof v === 'string' ? parseFloat(v.replace(/[$,\s]/g, '')) : Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const pos = (v) => Math.max(0, v);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function ordinaryTax(taxable) {
    let tax = 0;
    let lower = 0;
    for (const [upper, rate] of C.brackets) {
      if (taxable > lower) tax += (Math.min(taxable, upper) - lower) * rate;
      lower = upper;
    }
    return tax;
  }

  function marginalRate(taxable) {
    for (const [upper, rate] of C.brackets) if (taxable < upper) return rate;
    return C.brackets[C.brackets.length - 1][1];
  }

  // Qualified Dividends and Capital Gain Tax Worksheet
  function taxWithPreferential(taxable, preferential) {
    const pref = clamp(preferential, 0, taxable);
    const ordinary = taxable - pref;
    const at0 = clamp(Math.min(taxable, C.cg0Top) - ordinary, 0, pref);
    const at15 = clamp(Math.min(taxable, C.cg15Top) - ordinary - at0, 0, pref - at0);
    const at20 = pref - at0 - at15;
    return {
      tax: ordinaryTax(ordinary) + at15 * 0.15 + at20 * 0.2,
      ordinaryPortion: ordinary,
      at0,
      at15,
      at20,
    };
  }

  function scheduleSE(profitShare, w2SocialSecurityWages) {
    const netEarnings = pos(profitShare) * C.seFactor;
    if (netEarnings < C.seMinimum) {
      return { netEarnings: 0, socialSecurity: 0, medicare: 0, total: 0, deductibleHalf: 0 };
    }
    const ssRoom = pos(C.ssWageBase - pos(w2SocialSecurityWages));
    const socialSecurity = Math.min(netEarnings, ssRoom) * C.ssRate;
    const medicare = netEarnings * C.medicareRate;
    const total = socialSecurity + medicare;
    return { netEarnings, socialSecurity, medicare, total, deductibleHalf: total / 2 };
  }

  function normalize(input) {
    const i = input || {};
    const paid = Array.isArray(i.estimatedPaid) ? i.estimatedPaid : [];
    const ordinaryDividends = pos(num(i.ordinaryDividends));
    return {
      revenue: num(i.revenue),
      expenses: num(i.expenses),
      yourOwnershipPct: clamp(i.yourOwnershipPct == null ? 100 : num(i.yourOwnershipPct), 0, 100),
      spouseOwnershipPct: clamp(num(i.spouseOwnershipPct), 0, 100),
      yourW2Wages: pos(num(i.yourW2Wages)),
      spouseW2Wages: pos(num(i.spouseW2Wages)),
      federalWithholding: pos(num(i.federalWithholding)),
      interest: pos(num(i.interest)),
      ordinaryDividends,
      qualifiedDividends: clamp(num(i.qualifiedDividends), 0, ordinaryDividends),
      shortTermGains: num(i.shortTermGains),
      longTermGains: num(i.longTermGains),
      otherIncome: num(i.otherIncome),
      seHealthInsurance: pos(num(i.seHealthInsurance)),
      retirementContributions: pos(num(i.retirementContributions)),
      hsaContributions: pos(num(i.hsaContributions)),
      otherAdjustments: pos(num(i.otherAdjustments)),
      saltPaid: pos(num(i.saltPaid)),
      mortgageInterest: pos(num(i.mortgageInterest)),
      charitableCash: pos(num(i.charitableCash)),
      otherItemized: pos(num(i.otherItemized)),
      you65: !!i.you65,
      spouse65: !!i.spouse65,
      childrenUnder17: Math.floor(pos(num(i.childrenUnder17))),
      otherDependents: Math.floor(pos(num(i.otherDependents))),
      otherCredits: pos(num(i.otherCredits)),
      sstb: !!i.sstb,
      llcW2WagesPaid: pos(num(i.llcW2WagesPaid)),
      ubia: pos(num(i.ubia)),
      priorYearTax: i.priorYearTax === '' || i.priorYearTax == null ? null : pos(num(i.priorYearTax)),
      priorYearAgi: pos(num(i.priorYearAgi)),
      estimatedPaid: [0, 1, 2, 3].map((q) => pos(num(paid[q]))),
      strategy: i.strategy === 'payInFull' ? 'payInFull' : 'safeHarbor',
      statePct: clamp(num(i.statePct), 0, 20),
      drawFrequency: DRAW_FREQUENCIES[i.drawFrequency] ? i.drawFrequency : 'monthly',
      penaltyRatePct: i.penaltyRatePct == null || i.penaltyRatePct === '' ? 7 : clamp(num(i.penaltyRatePct), 0, 20),
      asOf: /^\d{4}-\d{2}-\d{2}$/.test(i.asOf || '') ? i.asOf : new Date().toISOString().slice(0, 10),
    };
  }

  /** Full-year federal tax projection. */
  function computeTax(rawInput) {
    const x = normalize(rawInput);
    const llcNetProfit = x.revenue - x.expenses;
    const yourProfit = (llcNetProfit * x.yourOwnershipPct) / 100;
    const spouseProfit = (llcNetProfit * x.spouseOwnershipPct) / 100;
    const householdProfit = yourProfit + spouseProfit;

    // Schedule SE, one per spouse who owns part of the LLC
    const seYou = scheduleSE(yourProfit, x.yourW2Wages);
    const seSpouse = scheduleSE(spouseProfit, x.spouseW2Wages);
    const seTax = seYou.total + seSpouse.total;
    const halfSeTax = seYou.deductibleHalf + seSpouse.deductibleHalf;
    const netSeEarnings = seYou.netEarnings + seSpouse.netEarnings;

    // Form 8959: additional Medicare tax (wages and SE income share the $250k threshold)
    const medicareWages = x.yourW2Wages + x.spouseW2Wages;
    const addlMedicareOnWages = pos(medicareWages - C.addlMedicareThreshold) * C.addlMedicareRate;
    const addlMedicareOnSe =
      pos(netSeEarnings - pos(C.addlMedicareThreshold - medicareWages)) * C.addlMedicareRate;
    const additionalMedicare = addlMedicareOnWages + addlMedicareOnSe;

    // Capital gains / losses (Schedule D)
    const netCapitalGain = x.shortTermGains + x.longTermGains;
    const capitalGainIncluded = netCapitalGain >= 0 ? netCapitalGain : Math.max(netCapitalGain, -C.capitalLossLimit);
    const preferentialGain = netCapitalGain > 0 ? clamp(x.longTermGains, 0, netCapitalGain) : 0;

    // Adjustments to income (Schedule 1, Part II)
    const retirementDeduction = x.retirementContributions;
    const seHealthDeduction = Math.min(x.seHealthInsurance, pos(householdProfit - halfSeTax - retirementDeduction));

    const totalIncome =
      x.yourW2Wages +
      x.spouseW2Wages +
      householdProfit +
      x.interest +
      x.ordinaryDividends +
      capitalGainIncluded +
      x.otherIncome;
    const adjustments = halfSeTax + seHealthDeduction + retirementDeduction + x.hsaContributions + x.otherAdjustments;
    const agi = totalIncome - adjustments;

    // Deductions
    const count65 = (x.you65 ? 1 : 0) + (x.spouse65 ? 1 : 0);
    const standardDeduction = C.stdDeduction + C.addlStd65 * count65;
    const saltLimit = Math.max(C.saltFloor, C.saltCap - pos(agi - C.saltPhaseoutStart) * C.saltPhaseoutRate);
    const saltAllowed = Math.min(x.saltPaid, saltLimit);
    const charityItemized = pos(x.charitableCash - pos(agi) * C.charityAgiFloor);
    const itemizedDeduction = saltAllowed + x.mortgageInterest + charityItemized + x.otherItemized;
    const itemizes = itemizedDeduction > standardDeduction;
    const deduction = itemizes ? itemizedDeduction : standardDeduction;
    const nonItemizerCharity = itemizes ? 0 : Math.min(x.charitableCash, C.charityNonItemizer);
    const seniorDeduction =
      count65 * pos(C.seniorDeduction - pos(agi - C.seniorPhaseoutStart) * C.seniorPhaseoutRate);

    const taxableBeforeQbi = pos(agi - deduction - nonItemizerCharity - seniorDeduction);

    // QBI deduction (§199A)
    const qbi = householdProfit - halfSeTax - seHealthDeduction - retirementDeduction;
    let qbiDeduction = 0;
    let qbiNote = 'No qualified business income.';
    if (qbi > 0) {
      const wageLimitFor = (share) =>
        Math.max(0.5 * x.llcW2WagesPaid * share, 0.25 * x.llcW2WagesPaid * share + 0.025 * x.ubia * share);
      let component;
      // Conservative: a service business fully phased out gets no $400 minimum either.
      let minimumApplies = true;
      if (taxableBeforeQbi <= C.qbiThreshold) {
        component = C.qbiRate * qbi;
        qbiNote = 'Full 20% (taxable income under the $403,500 threshold).';
      } else {
        const phase = Math.min(1, (taxableBeforeQbi - C.qbiThreshold) / C.qbiPhaseInRange);
        const applicable = x.sstb ? 1 - phase : 1;
        const tentative = C.qbiRate * qbi * applicable;
        const wageLimit = wageLimitFor(applicable);
        if (phase >= 1) {
          component = Math.min(tentative, wageLimit);
          minimumApplies = !x.sstb;
          qbiNote = x.sstb
            ? 'Service business above the phase-in range: no deduction.'
            : 'Above the phase-in range: limited to the W-2 wage / property limit.';
        } else {
          component = tentative - pos(tentative - wageLimit) * phase;
          qbiNote = `In the phase-in range (${Math.round(phase * 100)}% phased in).`;
        }
      }
      const incomeLimit = C.qbiRate * pos(taxableBeforeQbi - (x.qualifiedDividends + preferentialGain));
      qbiDeduction = Math.min(component, incomeLimit);
      if (qbiDeduction < component) qbiNote += ' Capped at 20% of taxable income less capital gains.';
      if (minimumApplies && qbi >= C.qbiMinimumActiveQbi && qbiDeduction < C.qbiMinimumDeduction) {
        qbiDeduction = Math.min(C.qbiMinimumDeduction, taxableBeforeQbi);
        qbiNote += ' Raised to the $400 minimum deduction.';
      }
    }

    const taxableIncome = pos(taxableBeforeQbi - qbiDeduction);

    // Income tax
    const pref = taxWithPreferential(taxableIncome, x.qualifiedDividends + preferentialGain);
    const incomeTaxBeforeCredits = pref.tax;

    // Credits
    const ctcBase = C.ctcPerChild * x.childrenUnder17 + C.odcPerDependent * x.otherDependents;
    const ctcReduction = 50 * Math.ceil(pos(agi - C.ctcPhaseoutStart) / 1000);
    const ctcAllowed = pos(ctcBase - ctcReduction);
    const ctcNonrefundable = Math.min(ctcAllowed, incomeTaxBeforeCredits);
    const earnedIncome = x.yourW2Wages + x.spouseW2Wages + netSeEarnings - halfSeTax;
    const refundableCtc = Math.min(
      ctcAllowed - ctcNonrefundable,
      C.ctcRefundablePerChild * x.childrenUnder17,
      pos(earnedIncome - C.ctcEarnedFloor) * C.ctcEarnedRate,
    );
    const otherCreditsUsed = Math.min(x.otherCredits, incomeTaxBeforeCredits - ctcNonrefundable);
    const incomeTax = incomeTaxBeforeCredits - ctcNonrefundable - otherCreditsUsed;

    // Net investment income tax (Form 8960)
    const netInvestmentIncome = pos(x.interest + x.ordinaryDividends + capitalGainIncluded);
    const niit = Math.min(netInvestmentIncome, pos(agi - C.niitThreshold)) * C.niitRate;

    const totalTax = incomeTax + seTax + additionalMedicare + niit - refundableCtc;

    return {
      input: x,
      llcNetProfit,
      yourProfit,
      spouseProfit,
      householdProfit,
      se: { you: seYou, spouse: seSpouse },
      seTax,
      halfSeTax,
      netSeEarnings,
      additionalMedicare,
      capitalGainIncluded,
      preferentialGain,
      totalIncome,
      seHealthDeduction,
      retirementDeduction,
      adjustments,
      agi,
      standardDeduction,
      itemizedDeduction,
      saltAllowed,
      saltLimit,
      itemizes,
      deduction,
      nonItemizerCharity,
      seniorDeduction,
      taxableBeforeQbi,
      qbi,
      qbiDeduction,
      qbiNote,
      taxableIncome,
      marginalRate: marginalRate(pref.ordinaryPortion),
      preferentialBreakdown: pref,
      incomeTaxBeforeCredits,
      ctcAllowed,
      ctcNonrefundable,
      refundableCtc,
      otherCreditsUsed,
      incomeTax,
      niit,
      totalTax,
      withholding: x.federalWithholding,
      effectiveRateOnAgi: agi > 0 ? totalTax / agi : 0,
    };
  }

  const DAY = 86400000;
  const toTime = (iso) => Date.parse(iso + 'T00:00:00Z');
  const daysBetween = (a, b) => Math.round((toTime(b) - toTime(a)) / DAY);

  /**
   * Approximate Form 2210 penalty: the underpayment rate times the running
   * shortfall, where each installment requires 25% of the required annual
   * payment and withholding is deemed paid evenly on the four due dates.
   */
  function estimatePenalty(requiredAnnual, withholding, payments, ratePct) {
    const events = [];
    C.dueDates.forEach((d) => events.push({ date: d, amount: requiredAnnual / 4 - withholding / 4 }));
    payments.forEach((p) => p.amount > 0 && events.push({ date: p.date, amount: -p.amount }));
    events.sort((a, b) => toTime(a.date) - toTime(b.date));
    let balance = 0;
    let penalty = 0;
    for (let k = 0; k < events.length; k++) {
      balance += events[k].amount;
      const next = k + 1 < events.length ? events[k + 1].date : C.filingDeadline;
      const end = toTime(next) > toTime(C.filingDeadline) ? C.filingDeadline : next;
      const days = daysBetween(events[k].date, end);
      if (balance > 0 && days > 0) penalty += (balance * (ratePct / 100) * days) / 365;
    }
    return penalty;
  }

  /** Quarterly 1040-ES plan: safe harbor, per-quarter status and catch-up. */
  function planEstimates(result) {
    const x = result.input;
    const currentTax = pos(result.totalTax);
    const w = result.withholding;
    const priorFactor = x.priorYearAgi > C.safeHarborHighAgi ? C.safeHarborHighAgiPct : 1;
    const priorYearSafeHarbor = x.priorYearTax == null ? null : x.priorYearTax * priorFactor;
    const currentYearSafeHarbor = currentTax * C.safeHarborCurrentPct;
    const requiredAnnual =
      priorYearSafeHarbor == null ? currentYearSafeHarbor : Math.min(currentYearSafeHarbor, priorYearSafeHarbor);
    const safeHarborBasis =
      priorYearSafeHarbor != null && priorYearSafeHarbor <= currentYearSafeHarbor
        ? `${Math.round(priorFactor * 100)}% of 2025 tax`
        : '90% of 2026 tax';
    const noPenaltyPossible = currentTax - w < C.penaltyFreeBalance;

    const targetTotal = x.strategy === 'payInFull' ? currentTax : requiredAnnual;
    const estimatesNeeded = pos(targetTotal - w);
    const perQuarter = estimatesNeeded / 4;

    const quarters = C.dueDates.map((due, q) => ({
      quarter: q + 1,
      due,
      planned: perQuarter,
      paid: x.estimatedPaid[q],
      past: toTime(x.asOf) > toTime(due),
    }));
    const paidTotal = x.estimatedPaid.reduce((a, b) => a + b, 0);
    const pastQuarters = quarters.filter((q) => q.past);
    const futureQuarters = quarters.filter((q) => !q.past);
    const plannedThroughNow = pastQuarters.reduce((a, q) => a + q.planned, 0);
    const paidThroughNow = pastQuarters.reduce((a, q) => a + q.paid, 0);
    const remaining = pos(estimatesNeeded - paidTotal);
    const catchUpNow = futureQuarters.length ? Math.min(remaining, pos(plannedThroughNow - paidThroughNow)) : 0;
    const splitFuture = futureQuarters.length ? pos(remaining - catchUpNow) / futureQuarters.length : 0;
    quarters.forEach((q) => {
      q.recommended = q.past ? 0 : splitFuture;
      q.status = q.past
        ? q.paid + 0.5 >= q.planned
          ? 'paid'
          : q.paid > 0
            ? 'short'
            : 'missed'
        : q.paid > 0
          ? 'partial'
          : 'upcoming';
    });
    const nextQuarter = futureQuarters[0] || null;

    const actualPayments = quarters
      .filter((q) => q.paid > 0)
      .map((q) => ({ date: q.due, amount: q.paid }));
    const planPayments = actualPayments.concat(
      catchUpNow > 0 ? [{ date: x.asOf, amount: catchUpNow }] : [],
      futureQuarters.map((q) => ({ date: q.due, amount: q.recommended })),
    );
    const penaltyIfFollowPlan = noPenaltyPossible
      ? 0
      : estimatePenalty(requiredAnnual, w, planPayments, x.penaltyRatePct);
    const penaltyIfNoMorePayments = noPenaltyPossible
      ? 0
      : estimatePenalty(requiredAnnual, w, actualPayments, x.penaltyRatePct);

    const totalPaidIfPlan = w + paidTotal + catchUpNow + splitFuture * futureQuarters.length;
    return {
      currentTax,
      withholding: w,
      priorYearSafeHarbor,
      currentYearSafeHarbor,
      requiredAnnual,
      safeHarborBasis,
      noPenaltyPossible,
      strategy: x.strategy,
      targetTotal,
      estimatesNeeded,
      perQuarter,
      quarters,
      paidTotal,
      remaining,
      catchUpNow,
      nextQuarter,
      balanceDueAtFiling: currentTax - totalPaidIfPlan,
      penaltyIfFollowPlan,
      penaltyIfNoMorePayments,
      asOf: x.asOf,
    };
  }

  const DRAW_FREQUENCIES = {
    weekly: { label: 'Weekly', periods: 52 },
    biweekly: { label: 'Every two weeks', periods: 26 },
    semimonthly: { label: 'Twice a month', periods: 24 },
    monthly: { label: 'Monthly', periods: 12 },
    quarterly: { label: 'Quarterly', periods: 4 },
  };

  const iso = (y, m, d) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);
  const lastDay = (y, m) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate();

  function drawDates(frequency) {
    const dates = [];
    if (frequency === 'weekly' || frequency === 'biweekly') {
      const step = frequency === 'weekly' ? 7 : 14;
      // First Friday of 2026 is January 2
      for (let t = toTime('2026-01-02'); new Date(t).getUTCFullYear() === TAX_YEAR; t += step * DAY) {
        dates.push(new Date(t).toISOString().slice(0, 10));
      }
    } else if (frequency === 'semimonthly') {
      for (let m = 0; m < 12; m++) dates.push(iso(TAX_YEAR, m, 15), iso(TAX_YEAR, m, lastDay(TAX_YEAR, m)));
    } else if (frequency === 'quarterly') {
      for (const m of [2, 5, 8, 11]) dates.push(iso(TAX_YEAR, m, lastDay(TAX_YEAR, m)));
    } else {
      for (let m = 0; m < 12; m++) dates.push(iso(TAX_YEAR, m, lastDay(TAX_YEAR, m)));
    }
    return dates;
  }

  /**
   * Owner-draw register: spreads LLC profit evenly over the year's pay dates,
   * reserves federal + state tax and planned contributions from each draw, and
   * interleaves the quarterly estimated payments against the federal reserve.
   */
  function planDraws(result, plan) {
    const x = result.input;
    const dates = drawDates(x.drawFrequency);
    const n = dates.length;
    const profit = result.householdProfit;
    const federalReserveAnnual = pos(plan.currentTax - plan.withholding);
    const stateReserveAnnual = pos(profit) * (x.statePct / 100);
    const contributionsAnnual = x.retirementContributions + x.seHealthInsurance + x.hsaContributions;
    const drawAnnual = profit - federalReserveAnnual - stateReserveAnnual - contributionsAnnual;

    const per = {
      profit: profit / n,
      federal: federalReserveAnnual / n,
      state: stateReserveAnnual / n,
      contributions: contributionsAnnual / n,
      draw: drawAnnual / n,
    };

    const rows = dates.map((date) => ({ kind: 'draw', date, ...per }));
    C.dueDates.forEach((date, q) =>
      rows.push({ kind: 'estimate', date, quarter: q + 1, federal: -plan.perQuarter }),
    );
    rows.sort((a, b) => toTime(a.date) - toTime(b.date) || (a.kind === 'estimate' ? 1 : -1));
    let reserve = 0;
    let lowest = 0;
    for (const r of rows) {
      reserve += r.federal;
      r.reserveBalance = reserve;
      r.past = toTime(r.date) < toTime(x.asOf);
      lowest = Math.min(lowest, reserve);
    }
    return {
      frequency: x.drawFrequency,
      frequencyLabel: DRAW_FREQUENCIES[x.drawFrequency].label,
      periods: n,
      per,
      annual: {
        profit,
        federal: federalReserveAnnual,
        state: stateReserveAnnual,
        contributions: contributionsAnnual,
        draw: drawAnnual,
      },
      setAsideRate: profit > 0 ? (federalReserveAnnual + stateReserveAnnual) / profit : 0,
      startingCushion: -lowest,
      rows,
    };
  }

  function retirementHints(result) {
    const netAfterHalfSe = pos(result.se.you.netEarnings / C.seFactor - result.se.you.deductibleHalf);
    const sepMax = Math.min(C.annualAdditionsLimit, netAfterHalfSe * C.sepRateOfNetSe);
    const solo401kMax = Math.min(
      C.annualAdditionsLimit,
      netAfterHalfSe,
      Math.min(C.electiveDeferralLimit, netAfterHalfSe) + netAfterHalfSe * C.sepRateOfNetSe,
    );
    return { sepMax, solo401kMax, catchUp50: C.catchUp50, hsaFamilyLimit: C.hsaFamilyLimit };
  }

  /** Everything the UI needs, including the tax caused by the LLC itself. */
  function run(input) {
    const result = computeTax(input);
    const withoutLlc = computeTax({
      ...result.input,
      revenue: 0,
      expenses: 0,
      seHealthInsurance: 0,
      retirementContributions: 0,
    });
    const plan = planEstimates(result);
    const draws = planDraws(result, plan);
    const llcTax = result.totalTax - withoutLlc.totalTax;
    return {
      taxYear: TAX_YEAR,
      result,
      plan,
      draws,
      llcAttributableTax: llcTax,
      llcEffectiveRate: result.householdProfit > 0 ? llcTax / result.householdProfit : 0,
      retirement: retirementHints(result),
    };
  }

  globalThis.LLCTax2026 = {
    TAX_YEAR,
    CONSTANTS: C,
    DRAW_FREQUENCIES,
    ordinaryTax,
    taxWithPreferential,
    scheduleSE,
    computeTax,
    planEstimates,
    planDraws,
    estimatePenalty,
    run,
  };
})();
