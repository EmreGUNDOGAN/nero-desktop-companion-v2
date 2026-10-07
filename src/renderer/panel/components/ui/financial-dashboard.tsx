import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronRight, History, Library, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export type QuickAction = {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
};
export type Activity = {
  id: string;
  icon: React.ElementType | React.ReactElement;
  title: string;
  time: string;
  amount: number;
  formattedAmount: string;
  type: 'income' | 'expense' | 'refund' | 'transfer';
};
export type Service = {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
};
export interface FinancialDashboardProps {
  quickActions: QuickAction[];
  recentActivity: Activity[];
  financialServices: Service[];
  onSearch: (query: string) => void;
  searchValue: string;
  onSearchChange: (query: string) => void;
  children?: React.ReactNode;
}

export function IconWrapper({ icon: Icon, className }: { icon: React.ElementType; className?: string }) {
  return <span className={cn('fd-icon flex shrink-0 items-center justify-center rounded-full', className)} aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>;
}

// The supplied dashboard is connected to Nero's existing actions and records.
// Semantic buttons, localized amounts and reduced motion replace demo behavior.
export function FinancialDashboard({ quickActions, recentActivity, financialServices, onSearch, searchValue, onSearchChange, children }: FinancialDashboardProps) {
  const reduced = useReducedMotion();
  return <motion.div className="fd-dashboard" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .16 }}>
    <form className="fd-search relative flex items-center rounded-xl border" role="search" onSubmit={e => { e.preventDefault(); onSearch(searchValue); }}>
      <Search size={18} aria-hidden="true" />
      <input id="finance-centre-search" aria-label="Bu ayın işlemlerinde ara" type="search" placeholder="İşlem, ödeme veya açıklama ara…" value={searchValue} onChange={e => onSearchChange(e.target.value)} />
      <kbd aria-hidden="true">Ctrl K</kbd>
      <button type="submit" className="fd-search-submit" aria-label="İşlemlerde ara"><ArrowRight size={17} /></button>
    </form>
    {children}
    <div className="fd-quick-grid grid grid-cols-2 sm:grid-cols-4 gap-2" aria-label="Hızlı işlemler">
      {quickActions.map(action => <motion.button key={action.action} type="button" data-budget-action={action.action} className="fd-quick" whileHover={reduced ? undefined : { scale: 1.05 }} transition={{ duration: .14 }}>
        <IconWrapper icon={action.icon} /><strong>{action.title}</strong><small>{action.description}</small>
      </motion.button>)}
    </div>
    <div className="fd-overview-grid">
      <section className="fd-card"><div className="fd-section-title"><h3><History size={17} />Son işlemler</h3><button type="button" data-budget-action="tab-transactions" className="fd-text-button">Tümü <ChevronRight size={14} /></button></div>
        {recentActivity.length ? <ul className="fd-activity-list">{recentActivity.map(activity => <li key={activity.id}>
          <button type="button" data-budget-action="edit-transaction" data-id={activity.id} className="fd-activity">
            {React.isValidElement(activity.icon) ? activity.icon : <IconWrapper icon={activity.icon as React.ElementType} />}
            <span className="fd-activity-copy"><strong>{activity.title}</strong><small>{activity.time}</small></span>
            <span className={cn('fd-amount', activity.type === 'income' || activity.type === 'refund' ? 'fd-positive' : activity.type === 'expense' ? 'fd-negative' : 'fd-neutral')}>
              {activity.type === 'income' || activity.type === 'refund' ? '+' : activity.type === 'expense' ? '−' : '↔'}{activity.formattedAmount}
            </span>
          </button>
        </li>)}</ul> : <div className="fd-empty"><History size={26} /><strong>Bu ay henüz işlem yok</strong><p>İlk gelirini veya harcamanı kaydet; hareketlerin burada görünsün.</p><button type="button" data-budget-action="new-transaction" className="fd-button fd-primary">İşlem ekle</button></div>}
      </section>
      <section className="fd-card"><div className="fd-section-title"><h3><Library size={17} />Finans araçların</h3></div><div className="fd-service-list">
        {financialServices.map(service => <motion.button key={service.action} type="button" data-budget-action={service.action} className="fd-service" whileHover={reduced ? undefined : { scale: 1.02 }} transition={{ duration: .14 }}>
          <IconWrapper icon={service.icon} /><span><strong>{service.title}</strong><small>{service.description}</small></span><ChevronRight size={17} aria-hidden="true" />
        </motion.button>)}
      </div></section>
    </div>
  </motion.div>;
}
