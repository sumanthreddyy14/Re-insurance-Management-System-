import { Routes } from '@angular/router';
import { TreatyList } from './features/treaty/treaty-list/treaty-list';
import { TreatyForm } from './features/treaty/treaty-form/treaty-form';
import { TreatyDetail } from './features/treaty/treaty-detail/treaty-detail';
import { RenewalCalendar } from './features/treaty/renewal-calendar/renewal-calendar';
import { ReinsurerDetail } from './features/reinsurer/reinsurer-detail/reinsurer-detail';
import { ReinsurerList } from './features/reinsurer/reinsurer-list/reinsurer-list';
import { RiskCessionList } from './features/risk-cession/risk-cession-list/risk-cession-list';
import { RiskCession } from './features/risk-cession/risk-cession-form/risk-cession-form';
import { RecoveryList } from './features/recovery/recovery-list/recovery-list';
import { RecoveryFormComponent } from './features/recovery/recovery-form/recovery-form';
import { RecoveryDetail } from './features/recovery/recovery-detail/recovery-detail';
import { AdminDashboard } from './features/Admin/admin-dashboard/admin-dashboard';
import { FinanceSummary } from './features/Financial-Report/finance-summary/finance-summary';
import { BalanceTable } from './features/Financial-Report/balance-table/balance-table';
import { ExportButton } from './features/Financial-Report/export-button/export-button';
import { FinancialReportList } from './features/Financial-Report/financial-report-list/financial-report-list';

export const routes: Routes = [
    { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'treaties', component: TreatyList },
  { path: 'treaties/new', component: TreatyForm },
  { path: 'treaties/:id/edit', component: TreatyForm },
  { path: 'treaties/:id', component: TreatyDetail},
  { path: 'treaties/renewals', component: RenewalCalendar },
  { path: 'renewals', component: RenewalCalendar },
  { path: 'reinsurers', component: ReinsurerList },
  { path: 'reinsurers/:id', component: ReinsurerDetail },
  { path: 'cessions', component: RiskCessionList },
  { path: 'cessions/new', component: RiskCession },
  { path: 'recoveries', component: RecoveryList },
   { path: 'recoveries/new', component: RecoveryFormComponent }, 
   { path: 'recoveries/:id', component: RecoveryDetail },
   { path: 'admin/dashboard', component: AdminDashboard },
   { path: 'financerep', component: FinanceSummary },
   { path: 'balance', component: BalanceTable },
   { path: 'export', component: ExportButton },
   { path: 'report', component: FinancialReportList }
];
