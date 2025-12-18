import { Routes } from '@angular/router';
import { TreatyList } from './features/treaty/treaty-list/treaty-list';
import { TreatyForm } from './features/treaty/treaty-form/treaty-form';
import { TreatyDetail } from './features/treaty/treaty-detail/treaty-detail';
import { RenewalCalendar } from './features/treaty/renewal-calendar/renewal-calendar';

export const routes: Routes = [
    { path: '', redirectTo: 'treaties', pathMatch: 'full' },
  { path: 'treaties', component: TreatyList },
  { path: 'treaties/new', component: TreatyForm },
  { path: 'treaties/:id/edit', component: TreatyForm },
  { path: 'treaties/:id', component: TreatyDetail},
  { path: 'treaties/renewals', component: RenewalCalendar }


];
