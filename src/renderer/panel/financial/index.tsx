import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { MotionConfig } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, BookOpen, CalendarDays, ChevronRight, CircleHelp, CreditCard, GraduationCap, Landmark, Plus, ReceiptText, Search, Settings2, Target, TrendingUp, Wallet } from 'lucide-react';
import { FinancialDashboard, IconWrapper } from '../components/ui/financial-dashboard';
import { createChart, inspectCharts } from '../premium/charts';
import { dailyFlow, inBase, scheduledFlow } from '../premium/data';

// The legacy finance engine owns writes, validation, dialogs and IPC.
// React receives a read-only view and delegates actions to that engine.
type EngineContext = {
  view: any; month: string; range: number; filters: any; planFilter: string;
  academyArea: string; academyModule: string | null; bookFilter: string; bookMode: string;
  currency: (amount: number, currency?: string) => string;
  when: (date: string) => string;
  account: (id: string) => any;
  category: (id: string) => any;
  budgetCategory: (id: string) => string;
  transactionRow: (transaction: any) => string;
  transactions: () => string;
  transactionStatistics: (type: string) => string;
  paymentGroups: (rows: any[], compact?: boolean) => string;
  brandIcon: (id: string, name: string, type: string) => string;
  monthlySummary: () => string;
  onboarding: () => string;
  handbook: () => string;
  academyList: () => string;
  sortNewest: (a: any, b: any) => number;
  searchTransactions: (query: string) => void;
};
declare global {
  interface Window {
    NeroHandbook: any;
    NeroFinancialUI: { mount: typeof mount; detach: typeof detach; inspectCharts: typeof inspectCharts };
  }
}
const Context = createContext<EngineContext | null>(null);
const useFinance = () => useContext(Context)!;
const colors = ['#05df72', '#ff6467', '#a1a1a1', '#d4d4d4', '#737373', '#525252'];
const chartTheme = { palette: colors, grid: '#2e2e2e', muted: '#a1a1a1', track: '#262626', readoutInk: '#0a0a0a' };
const titleOf: Record<string, string> = { overview: 'Parana genel bakış', transactions: 'İşlemler', accounts: 'Hesapların', budgets: 'Birikim ve bütçe', plans: 'Planlı ödemeler', reports: 'Raporlar', calendar: 'Ödeme takvimi', handbook: 'Finans Akademisi' };
const subtitleOf: Record<string, string> = { overview: 'Bugünün bakiyesi, bu ayın hareketleri.', transactions: 'Gelen ve giden para, düzenli bir yerde.', accounts: 'Paranın bulunduğu yerleri birlikte gör.', budgets: 'Hedeflerine yer aç, harcamalarına yön ver.', plans: 'Yaklaşan tarihler ve düzenli kayıtların.', reports: 'Kayıtlarının anlattığı finansal görünüm.', calendar: 'Ödemelerini bir bakışta planla.', handbook: 'Parayı anlamak için küçük, sağlam adımlar.' };

function Action({ action, id = '', children, primary = false, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { action: string; id?: string; primary?: boolean }) {
  return <button type="button" data-budget-action={action} data-id={id} className={`fd-button ${primary ? 'fd-primary' : 'fd-secondary'} ${className}`} {...props}>{children}</button>;
}
function Card({ title, icon: Icon, action, label = 'Tümü', children, className = '' }: { title?: string; icon?: React.ElementType; action?: string; label?: string; children: React.ReactNode; className?: string }) {
  return <section className={'fd-card ' + className}>{title && <div className="fd-section-title"><h3>{Icon && <Icon size={17} />}{title}</h3>{action && <Action action={action} className="fd-text-button">{label}<ChevronRight size={14} /></Action>}</div>}{children}</section>;
}
function Html({ html, id, className = '' }: { html: string; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { ref.current!.innerHTML = html; }, [html]);
  return <div ref={ref} id={id} className={'fd-legacy ' + className} />;
}
function Empty({ icon: Icon = Wallet, title, children, action, label }: { icon?: React.ElementType; title: string; children: React.ReactNode; action?: string; label?: string }) {
  return <div className="fd-empty"><Icon size={28} strokeWidth={1.5} /><strong>{title}</strong><p>{children}</p>{action && <Action action={action} primary>{label}</Action>}</div>;
}
function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, value / max * 100)) : 0;
  return <div className="fd-progress" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}><span style={{ width: percent + '%' }} /></div>;
}
function Canvas({ kind, rows, label, className = '', ...options }: { kind: string; rows: any[]; label: string; className?: string; [key: string]: any }) {
  const ref = useRef<HTMLCanvasElement>(null), c = useFinance();
  useLayoutEffect(() => createChart(ref.current, { kind, rows, format: c.currency, ...chartTheme, ...options }), [kind, JSON.stringify(rows), options.focus]);
  return <div className={'fd-chart ' + className}><canvas ref={ref} role="img" aria-label={label} /></div>;
}
function Flow({ monthly = false }: { monthly?: boolean }) {
  const c = useFinance();
  const rows = monthly ? c.view.trend.slice(-c.range).map((r: any) => ({ ...r, label: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(new Date(r.month + '-01T12:00:00')) })) : dailyFlow(c.view, c.month);
  return <><Canvas kind="line" rows={rows} label={monthly ? 'Aylık gelir ve net gider' : 'Bu ayın günlük gelir ve net giderleri'} /><div className="fd-chart-legend"><span><i />Gelir</span><span><i />Net gider</span></div>{rows.every((r: any) => !r.income && !r.netExpense) && <p className="fd-note">Bu dönemde gerçekleşmiş işlem yok.</p>}<details className="fd-details"><summary>Grafiği tutarlarla oku</summary><dl className="fd-facts">{rows.map((r: any) => <div key={r.month}><dt>{r.month.length > 7 ? c.when(r.month) : r.label + ' ' + r.month.slice(0, 4)}</dt><dd>{c.currency(r.income)} / {c.currency(r.netExpense)}</dd></div>)}</dl><p className="fd-note">Gelir / net gider; temel para biriminde.</p></details></>;
}
function Metrics({ planned = false }: { planned?: boolean }) {
  const c = useFinance(), v = c.view;
  return <div className="fd-metrics"><button type="button" data-budget-action={planned ? 'planned-income' : 'monthly-income'}><IconWrapper icon={ArrowDownLeft} className="fd-positive-icon" /><span><small>{planned ? 'Beklenen gelir' : 'Bu ay gelir'}</small><strong>{c.currency(planned ? v.cashFlow.expected : v.summary.income)}</strong></span><ChevronRight size={14} /></button><button type="button" data-budget-action={planned ? 'month-payments' : 'monthly-expense'}><IconWrapper icon={ArrowUpRight} className="fd-negative-icon" /><span><small>{planned ? 'Bu ay ödenecek' : 'Bu ay net gider'}</small><strong>{c.currency(planned ? v.cashFlow.payable : v.summary.netExpense)}</strong></span><ChevronRight size={14} /></button></div>;
}
function Balance() {
  const c = useFinance();
  return <div className="fd-balance-block"><button type="button" data-budget-action="tab-accounts" className="fd-balance"><span><Wallet size={16} />Mevcut paran</span><strong>{c.currency(c.view.cashFlow.available)}</strong><small>Banka ve nakit toplamı <ChevronRight size={12} /></small></button><button type="button" data-budget-action="help" data-id="balance" className="fd-help" aria-label="Mevcut para nasıl hesaplanır?"><CircleHelp size={18} /></button></div>;
}
function Overview() {
  const c = useFinance(), [search, setSearch] = useState(''), v = c.view;
  const latest = v.transactions.filter((t: any) => t.date.startsWith(c.month) && t.date <= v.today).sort(c.sortNewest).slice(0, 5);
  const actions = [{ icon: ArrowDownLeft, title: 'Gelir ekle', description: 'Gelen parayı kaydet', action: 'new-income' }, { icon: ArrowUpRight, title: 'Gider ekle', description: 'Harcamalarını takip et', action: 'new-expense' }, { icon: ArrowLeftRight, title: 'Transfer', description: 'Hesaplar arasında', action: 'new-transfer' }, { icon: CreditCard, title: 'Hesaplar', description: 'Bakiye ve kartlar', action: 'tab-accounts' }];
  const services = [{ icon: Target, title: 'Birikim hedeflerin', description: `${v.goals.filter((g: any) => !g.archived).length} aktif hedef · bütçe limitlerin`, action: 'tab-budgets' }, { icon: CalendarDays, title: 'Ödeme takvimi', description: 'Yaklaşan tarihler, taksitler ve kartlar', action: 'tab-calendar' }, { icon: TrendingUp, title: 'Nakit akışı', description: 'Gelir ve harcamalarının ayrıntıları', action: 'tab-reports' }, { icon: GraduationCap, title: 'Finans Akademisi', description: 'Dersler, sözlük ve hesaplayıcılar', action: 'tab-handbook' }];
  const recent = latest.map((t: any) => ({ id: t.id, icon: <Html html={c.brandIcon(t.brandId, t.payee || t.note, t.type)} className="fd-brand" />, title: t.payee || t.note || c.category(t.splits?.[0]?.categoryId)?.name || 'İşlem', time: `${c.when(t.date)} · ${c.account(t.accountId)?.name || ''} · ${{ income: 'Gelir', expense: 'Gider', refund: 'İade', transfer: 'Transfer' }[t.type as string] || ''}`, amount: t.amount, formattedAmount: c.currency(t.amount, t.currency), type: t.type }));
  return <><FinancialDashboard quickActions={actions} recentActivity={recent} financialServices={services} onSearch={c.searchTransactions} searchValue={search} onSearchChange={setSearch}><Card className="fd-overview-balance"><Balance /><Metrics /></Card></FinancialDashboard>
    <div className="fd-two-columns"><Card title="Bu ayın para akışı" icon={TrendingUp}><Flow /></Card><Card title="Ödemeler sonrası" icon={CalendarDays}><strong className="fd-total">{c.currency(v.cashFlow.afterPayments)}</strong><p className="fd-note">Mevcut para − bu ayın bekleyen ödemeleri.</p><dl className="fd-facts"><div><dt>Beklenen gelir</dt><dd><Action action="planned-income" className="fd-text-button">{c.currency(v.cashFlow.expected)}</Action></dd></div><div><dt>Toplam kalan taksit borcu</dt><dd><Action action="installments" className="fd-text-button">{c.currency(v.cashFlow.installmentDebt)}</Action></dd></div></dl><p className="fd-note">Beklenen gelir ve toplam borç mevcut bakiyeye karışmaz.</p></Card></div><Card title="Yaklaşan ödemeler" icon={CalendarDays} action="tab-plans"><Html html={c.paymentGroups(v.upcoming.filter((o: any) => o.type !== 'income'), true)} /></Card>{v.missingRates.length > 0 && <p className="budget-warning">Eksik kurlu hesaplar toplama dahil edilmedi.</p>}<Html html={c.onboarding()} /></>;
}
function Transactions() {
  const c = useFinance(), html = c.transactions();
  const toolbarStart = html.indexOf('<div class="budget-toolbar">'), formStart = html.indexOf('<div class="budget-card budget-filters">'), listStart = html.indexOf('<div id="budget-transaction-results">');
  const toolbar = html.slice(toolbarStart, formStart), form = html.slice(formStart, listStart), search = form.match(/<label>Ara[\s\S]*?<\/label>/)?.[0] || '';
  return <><Card className="fd-filter-card"><div className="fd-search-filter"><Search size={18} /><Html html={search} /></div><Html html={toolbar} /><details className="fd-details"><summary>Tür, tarih, hesap ve kategori filtreleri</summary><Html html={form.replace(search, '')} /></details></Card><div className="fd-two-columns"><Card title="İşlem geçmişi" icon={ReceiptText}><Html html={html.slice(listStart)} /></Card><section><Card title="Aylık görünüm" icon={TrendingUp}><Metrics /><Flow /></Card><Card title="Seçili türün istatistikleri"><Html id="budget-transaction-statistics" html={['income', 'expense'].includes(c.filters.type) ? c.transactionStatistics(c.filters.type) : '<p class="budget-muted">Filtrelerden gelir veya gider seçerek toplamı ve önceki ayla karşılaştırmayı gör.</p>'} /></Card></section></div></>;
}
function Accounts() {
  const c = useFinance(), v = c.view;
  const rows = v.accounts.filter((a: any) => !a.archived).map((a: any) => ({ name: a.name, amount: inBase(a.balance, a.currency, v.baseCurrency, v.rates) })).filter((a: any) => a.amount !== null);
  return <><div className="fd-actions"><Action action="new-account" primary><Plus size={16} />Hesap ekle</Action><Action action="new-transfer"><ArrowLeftRight size={16} />Transfer</Action><Action action="categories">Kategoriler</Action><Action action="rates">Kurlar</Action></div><Card><Balance /><details className="fd-details"><summary>Hesaplar ne işe yarar?</summary><p>Banka, cüzdan ve kredi kartı, paranın veya borcunun izlendiği yerlerdir. Maaş bir gelir kategorisidir. Başlangıç bakiyesi gelir sayılmaz; kart numarası veya şifre gerekmez.</p></details></Card><div className="fd-account-grid">{v.accounts.map((a: any, i: number) => <Card key={a.id} className={a.archived ? 'budget-archived' : ''}><div className="fd-account-head"><IconWrapper icon={a.type === 'credit' ? CreditCard : a.type === 'bank' ? Landmark : Wallet} /><span><h3>{a.name}</h3><small>{{ bank: 'Banka', cash: 'Nakit', credit: 'Kredi kartı' }[a.type as string]} · {a.currency}{a.archived ? ' · Arşiv' : ''}</small></span><Action action="edit-account" id={a.id} className="fd-icon-button" aria-label={a.name + ' hesabını düzenle'}><Settings2 size={17} /></Action></div><small className="fd-overline">{a.type === 'credit' ? 'Toplam kart borcu' : 'Hesap bakiyesi'}</small><strong className="fd-total">{c.currency(a.type === 'credit' ? Math.max(0, -a.balance) : a.balance, a.currency)}</strong>{a.statement ? <><Progress value={a.statement.debt} max={a.limit} label={a.name + ' limit kullanımı'} /><dl className="fd-facts"><div><dt>Kullanılabilir limit</dt><dd>{c.currency(a.statement.available, a.currency)}</dd></div><div><dt>Son ödeme</dt><dd>{c.when(a.statement.due)}</dd></div></dl><Action action="card-payment" id={a.id} primary>Kart ödemesi</Action><details className="fd-details"><summary>Ekstre ayrıntıları</summary><p>Son kesim {c.when(a.statement.cut)}. Dönem harcamaları {c.currency(a.statement.billed, a.currency)}; taksitler {c.currency(a.statement.installmentDue, a.currency)}. Yaklaşık ödenecek {c.currency(a.statement.estimatedDue, a.currency)}. Banka ekstresiyle kontrol et.</p></details></> : <dl className="fd-facts"><div><dt>Hedeflere ayrılan</dt><dd>{c.currency(a.reserved, a.currency)}</dd></div><div><dt>Serbest bakiye</dt><dd>{c.currency(a.balance - a.reserved, a.currency)}</dd></div></dl>}</Card>)}</div>{!v.accounts.length && <Card><Empty title="İlk hesabını ekle" action="new-account" label="Hesap oluştur">Banka hesabın, cüzdanın veya kredi kartınla başlayabilirsin.</Empty></Card>}<Card title="Hesap karşılaştırması" icon={Landmark}><Canvas kind="bar" horizontal rows={rows} label="Temel para biriminde hesap bakiyeleri" /><p className="fd-note">Kart borçları negatif bakiyedir; mevcut para toplamına eklenmez. Eksik kurlar hariç tutulur.</p></Card></>;
}
function Savings() {
  const c = useFinance(), v = c.view, goals = v.goals.filter((g: any) => !g.archived);
  const all = goals.map((g: any) => ({ id: g.id, name: g.name, amount: inBase(g.saved, g.currency, v.baseCurrency, v.rates) })), rows = all.filter((g: any) => g.amount !== null);
  const total = rows.reduce((sum: number, g: any) => sum + g.amount, 0);
  return <><div className="fd-actions"><Action action="new-goal" primary><Plus size={16} />Birikim hedefi</Action><Action action="new-budget">Harcama limiti</Action></div><div className="fd-two-columns"><Card title="Birikim görünümü" icon={Target}><div className="fd-ring"><Canvas kind="ring" rows={rows} label="Birikim hedeflerine ayrılan paranın dağılımı" /><div className="fd-ring-label"><small>Toplam birikim</small><strong>{c.currency(total)}</strong><small>{goals.length} aktif hedef</small></div></div><p className="fd-note">Hesaplarının içinde ayrılan rezervdir. Gelir veya gider oluşturmaz.</p>{all.some((g: any) => g.amount === null) && <p className="budget-warning">Eksik kurlu hedefler toplama dahil değil.</p>}</Card><section><div className="fd-section-title"><h3>Birikim hedeflerin</h3></div>{v.goals.map((g: any, i: number) => <Card key={g.id} className={'fd-goal-card ' + (g.archived ? 'budget-archived' : '')}><div className="fd-account-head"><IconWrapper icon={Target} /><span><h3>{g.name}</h3><small>{c.account(g.accountId)?.name}{g.archived ? ' · Arşiv' : ''}</small></span></div><div className="fd-goal-values"><strong>{c.currency(g.saved, g.currency)}</strong><small> / {c.currency(g.target, g.currency)}</small></div><Progress value={g.saved} max={g.target} label={g.name + ' birikim ilerlemesi'} /><div className="fd-goal-meta"><small>{g.deadline ? c.when(g.deadline) : 'Tarih sınırı yok'}</small><small>{Math.min(100, g.saved / g.target * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}%</small></div><div className="fd-actions"><Action action="edit-goal" id={g.id}>Düzenle</Action>{!g.archived && <Action action="fund-goal" id={g.id} primary>Para ayır / geri al</Action>}</div></Card>)}{!v.goals.length && <Card><Empty icon={Target} title="Bir hedefle başla" action="new-goal" label="Hedef oluştur">İstediğin tutarı belirle, birikiminin ilerlemesini gör.</Empty></Card>}</section></div><Card title="Aylık harcama limitleri" icon={Wallet}>{v.budgets.map((b: any) => <article key={b.id} className="fd-limit"><div className="fd-section-title"><h3>{c.budgetCategory(b.categoryId)}</h3><Action action="edit-budget" id={b.id} className="fd-text-button">Düzenle</Action></div><div className="fd-limit-values"><strong>{c.currency(b.spent)}</strong><small> / {c.currency(b.limit)}</small><b className={b.remaining < 0 ? 'budget-negative' : ''}>{b.remaining < 0 ? 'Aşım ' : 'Kalan '}{c.currency(Math.abs(b.remaining))}</b></div><Progress value={b.spent} max={b.limit} label={c.budgetCategory(b.categoryId) + ' limit kullanımı'} /><p className="fd-note">{b.rollover ? 'Önceki ayın kullanılmayan limiti devredilir.' : 'Seçili ayın harcama limiti.'}</p><Action action="delete-budget" id={b.id} className="fd-text-button">Limiti kaldır</Action></article>)}{!v.budgets.length && <Empty title="Harcamana bir sınır belirle" action="new-budget" label="Limit oluştur">Toplam veya kategori bazında aylık bir limit seç.</Empty>}</Card></>;
}
function Payments() {
  const c = useFinance(), v = c.view;
  const filter = (o: any) => c.planFilter === 'all' || (c.planFilter === 'income' ? o.type === 'income' : o.type !== 'income');
  const paid = v.transactions.filter((t: any) => t.planId && t.occurrence?.startsWith(c.month)).sort(c.sortNewest);
  return <><div className="fd-actions"><Action action="new-plan" primary><Plus size={16} />Düzenli işlem</Action><Action action="new-installment">Taksit planı</Action><Action action="installments">Taksit borçları</Action><Action action="notification-settings" aria-label="Bildirim ayarları"><Settings2 size={16} /></Action></div><Metrics planned /><div className="fd-two-columns"><section><Card title="Yaklaşan tarihler" icon={CalendarDays}><label className="fd-field">Göster<select id="budget-plan-filter" defaultValue={c.planFilter}><option value="all">Tüm planlar</option><option value="income">Beklenen gelirler</option><option value="expense">Bekleyen ödemeler</option></select></label><Html html={c.paymentGroups(v.upcoming.filter(filter))} /><p className="fd-note">Yaklaşan liste, bulunduğun ay ve sonraki ayı kapsar.</p></Card>{v.overdue.length > 0 && <Card><details className="fd-details"><summary>Gecikmiş kayıtlar · {v.overdue.filter(filter).length}</summary><Html html={c.paymentGroups(v.overdue.filter(filter).slice(0, 100))} /></details></Card>}<Card title="Bu ay kaydedilenler" icon={ReceiptText}>{paid.length ? paid.map((t: any) => <div key={t.id} className="fd-paid"><span><strong>{t.payee || t.note}</strong><small>{c.when(t.date)} · {c.currency(t.amount, t.currency)}</small></span><Action action="unpay-plan" id={t.planId + '|' + t.occurrence}>Geri al</Action></div>) : <p className="fd-note">Henüz kaydedilmiş planlı işlem yok.</p>}</Card></section><section><Card title="Haftalık ödeme akışı" icon={TrendingUp}><Canvas kind="bar" rows={scheduledFlow(v, c.month)} keys={['income', 'expense']} label="Haftalık beklenen gelir ve ödemeler" /><div className="fd-chart-legend"><span><i />Gelir</span><span><i />Ödeme</span></div></Card><Card title="Düzenli kayıtların">{v.plans.map((p: any) => <article key={p.id} className="fd-plan"><div className="fd-account-head"><Html html={c.brandIcon(p.brandId, p.name, p.type)} /><span><h3>{p.name}</h3><small>{p.paused ? 'Duraklatıldı' : p.auto ? 'Otomatik kayıt' : 'Manuel onay'}{p.count ? ` · ${p.count} taksit` : ''}</small></span></div><strong>{c.currency(p.revisions?.at(-1)?.amount || p.amount, c.account(p.accountId)?.currency)}</strong><div className="fd-actions"><Action action="edit-plan" id={p.id}>Düzenle</Action><Action action="pause-plan" id={p.id}>{p.paused ? 'Devam ettir' : 'Duraklat'}</Action></div></article>)}{!v.plans.length && <Empty icon={CalendarDays} title="Düzenli kayıtların burada" action="new-plan" label="Plan oluştur">Abonelik, gelir veya ödeme için tekrar sıklığı belirle.</Empty>}</Card></section></div></>;
}
function Reports() {
  const c = useFinance(), v = c.view;
  const rows = Object.entries(v.summary.categories).filter(([, n]) => Number(n) > 0).sort((a, b) => Number(b[1]) - Number(a[1])).map(([id, amount]) => ({ id, amount: Number(amount), name: c.category(id)?.name || 'Kategori' }));
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  return <><div className="fd-actions"><Action action="report-pdf">PDF raporu</Action><Action action="csv-export">CSV dışa aktar</Action></div><Metrics /><div className="fd-two-columns"><Card title="Gelir ve gider eğilimi" icon={TrendingUp}><div className="fd-pills">{[3, 6, 12].map(n => <Action key={n} action="pb-range" id={String(n)} aria-pressed={c.range === n}>{n} ay</Action>)}</div><Flow monthly /></Card><Card title="Harcama dağılımı" icon={ReceiptText}><div className="fd-ring"><Canvas kind="ring" rows={rows} label="Pozitif net kategori giderlerinin dağılımı" /><div className="fd-ring-label"><small>Toplam dağılım</small><strong>{c.currency(total)}</strong><small>{rows.length} kategori</small></div></div><div className="fd-category-list">{rows.map((r, i) => <button type="button" key={r.id} data-budget-action="category-details" data-id={r.id}><i style={{ background: colors[i % colors.length] }} /><span>{r.name}<small>{total ? (r.amount / total * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) : 0}%</small></span><strong>{c.currency(r.amount)}</strong></button>)}</div>{!rows.length && <p className="fd-note">Bu dönemde dağılım için pozitif net kategori gideri yok.</p>}{Object.values(v.summary.categories).some(n => Number(n) < 0) && <p className="fd-note">İade nedeniyle negatif kategoriler halkaya dahil edilmez; aylık dökümde görünür.</p>}</Card></div><Html html={c.monthlySummary()} /><Card title="En büyük harcamalar" icon={ReceiptText}><Html html={v.transactions.filter((t: any) => t.type === 'expense' && t.date.startsWith(c.month) && t.date <= v.today).sort((a: any, b: any) => b.baseAmount - a.baseAmount).slice(0, 5).map(c.transactionRow).join('') || '<p class="budget-muted">Bu ay henüz harcama yok.</p>'} /></Card><Card><details className="fd-details"><summary>Değişiklik geçmişi</summary>{v.audit.slice(0, 15).map((a: any, i: number) => <p key={i} className="fd-note">{new Date(a.at).toLocaleString('tr-TR')} · {a.action}</p>)}</details></Card></>;
}
function Calendar() {
  const c = useFinance(), v = c.view, days = new Date(Number(c.month.slice(0, 4)), Number(c.month.slice(5)), 0).getDate();
  const pad = (new Date(c.month + '-01T12:00:00').getDay() + 6) % 7;
  const events = v.calendar.filter((o: any) => o.date.startsWith(c.month)), cards = v.cardDates.filter((a: any) => a.debt > 0 && a.date.startsWith(c.month));
  return <div className="fd-two-columns"><section><Card title="Ayın takvimi" icon={CalendarDays}><div className="fd-calendar-grid">{['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <small key={d}>{d}</small>)}{Array.from({ length: pad }, (_, i) => <span key={'pad' + i} />)}{Array.from({ length: days }, (_, i) => { const date = c.month + '-' + String(i + 1).padStart(2, '0'), count = events.filter((e: any) => e.date === date).length + cards.filter((e: any) => e.date === date).length; return <button type="button" key={date} data-budget-action="calendar-day" data-id={date} className={'fd-day ' + (date === v.today ? 'fd-today' : '')} aria-label={`${c.when(date)}, ${count} bekleyen kayıt`}>{i + 1}{count > 0 && <i />}</button>; })}</div><p className="fd-note">Noktalı günlere tıklayarak bekleyen kayıtları aç.</p></Card><Card title="Haftalık ödeme yoğunluğu"><Canvas kind="bar" rows={scheduledFlow(v, c.month)} keys={['income', 'expense']} label="Seçili ayın haftalık beklenen gelir ve ödemeleri" /><div className="fd-chart-legend"><span><i />Gelir</span><span><i />Ödeme</span></div></Card></section><Card title="Bu ayın bekleyenleri" icon={CalendarDays}><Html html={c.paymentGroups(events)} />{cards.map((card: any) => <article key={card.id} className="fd-plan"><div className="fd-account-head"><IconWrapper icon={CreditCard} /><span><h3>{card.name}</h3><small>Son ödeme {c.when(card.date)}</small></span></div><Action action="card-payment" id={card.id}>Kart ödemesi</Action></article>)}</Card></div>;
}
function Academy() {
  const c = useFinance(), v = c.view, h = window.NeroHandbook, read = v.learning.read.length;
  const last = h.chapters.find((ch: any) => ch.id === v.learning.last), module = h.modules.find((m: any) => m.id === c.academyModule);
  return <><Card className="fd-academy-welcome"><IconWrapper icon={GraduationCap} /><div><h3>Öğrenme yolculuğun</h3><p>{read} / {h.chapters.length} ders tamamlandı</p><Progress value={read} max={h.chapters.length} label="Finans Akademisi ders ilerlemesi" /></div><strong>{Math.round(read / h.chapters.length * 100)}%</strong></Card><div className="fd-pills">{[['learn', 'Dersler'], ['tools', 'Araçlar'], ['dictionary', 'Sözlük']].map(([id, label]) => <Action key={id} action="academy-area" id={id} aria-pressed={c.academyArea === id}>{label}</Action>)}</div>{c.academyArea !== 'learn' ? <Card><Html html={c.handbook().replace(/<div class="academy-menu"[\s\S]*?<\/div>/, '')} /></Card> : <><Card><div className="fd-academy-search"><label className="fd-field">Ders ara<input id="budget-book-search" type="search" defaultValue={c.bookFilter} placeholder="Kart, enflasyon, birikim…" /></label><label className="fd-field">Göster<select id="budget-book-mode" defaultValue={c.bookMode}><option value="all">Tüm dersler</option><option value="bookmarks">Kaydettiklerim</option><option value="read">Okuduklarım</option></select></label></div></Card>{last && !module && !c.bookFilter && <Card className="fd-continue"><IconWrapper icon={BookOpen} /><span><small>Kaldığın yerden</small><strong>{last.title}</strong></span><Action action="read-chapter" id={last.id} primary>Devam et</Action></Card>}<div className="fd-section-title"><h3>{module ? module.title : 'Öğrenme alanları'}</h3>{module && <Action action="academy-back" className="fd-text-button">Tüm konular</Action>}</div><Html id="budget-chapter-list" html={c.academyList()} className="fd-modules" /></>}</>;
}
const pages: Record<string, React.ComponentType> = { overview: Overview, transactions: Transactions, accounts: Accounts, budgets: Savings, plans: Payments, reports: Reports, calendar: Calendar, handbook: Academy };
function Screen({ page }: { page: string }) {
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (document.documentElement.dataset.tab !== 'budget' || document.querySelector('dialog[open]')) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { const input = document.getElementById('finance-centre-search') || document.querySelector<HTMLInputElement>('[data-budget-filter="search"]') || document.getElementById('budget-book-search'); if (input) { event.preventDefault(); input.focus(); } }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  const Page = pages[page] || Overview;
  return <div className={'fd-screen fd-' + page} data-renderer="react-financial-dashboard"><header className="fd-page-intro"><span className="fd-eyebrow">NERO · FİNANS MERKEZİ</span><h2>{titleOf[page]}</h2><p>{subtitleOf[page]}</p></header><Page /></div>;
}
let root: Root | undefined, host: HTMLElement | undefined;
function mount(node: HTMLElement, page: string, context: EngineContext) {
  if (node !== host) { root?.unmount(); host = node; root = createRoot(node); }
  flushSync(() => root!.render(<MotionConfig reducedMotion="user"><Context.Provider value={context}><Screen key={page} page={page} /></Context.Provider></MotionConfig>));
}
function detach() { if (root) { flushSync(() => root!.unmount()); root = undefined; host = undefined; } }
window.NeroFinancialUI = Object.freeze({ mount, detach, inspectCharts });
