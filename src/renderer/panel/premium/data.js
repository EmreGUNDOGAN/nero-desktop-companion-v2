function inBase(amount, currency, base, rates) {
  if (currency === base) return Number(amount) || 0;
  const rate = rates[currency];
  if (!Number.isSafeInteger(rate) || rate <= 0) return null;
  const product = BigInt(Math.round(Number(amount) || 0)) * BigInt(rate);
  return Number((product + (product < 0n ? -500000n : 500000n)) / 1000000n);
}
function dailyFlow(view, month) {
  const end = month === view.today.slice(0, 7) ? Number(view.today.slice(8)) : new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate();
  return Array.from({ length: end }, (_, i) => {
    const date = month + '-' + String(i + 1).padStart(2, '0');
    const rows = view.transactions.filter(t => t.date === date && t.date <= view.today);
    return { month: date, label: String(i + 1), income: rows.reduce((n, t) => n + (t.type === 'income' ? t.baseAmount : 0), 0), netExpense: rows.reduce((n, t) => n + (t.type === 'expense' ? t.baseAmount : t.type === 'refund' ? -t.baseAmount : 0), 0) };
  });
}
function scheduledFlow(view, month) {
  const days = new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate();
  return Array.from({ length: Math.ceil(days / 7) }, (_, i) => {
    const rows = view.calendar.filter(o => o.date.startsWith(month) && Math.min(4, Math.floor((Number(o.date.slice(8)) - 1) / 7)) === i);
    const sum = type => rows.filter(o => o.type === type).reduce((n, o) => n + (inBase(o.amount, o.currency, view.baseCurrency, { ...view.rates, [o.currency]: o.rate || view.rates[o.currency] }) || 0), 0);
    return { name: `${i * 7 + 1}–${Math.min(days, i * 7 + 7)}`, income: sum('income'), expense: sum('expense') };
  });
}

module.exports = { inBase, dailyFlow, scheduledFlow };
