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

export const routes: Routes = [
    { path: '', redirectTo: 'treaties', pathMatch: 'full' },
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
];
