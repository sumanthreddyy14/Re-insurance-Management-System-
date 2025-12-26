import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardCards } from '../dashboard-cards/dashboard-cards';
import { ExpiryAlert } from '../expiry-alert/expiry-alert';
import { QuickLinks } from '../quick-links/quick-links';
import { TreatyService } from '../../../services/treaty.service';
import { RecoveryService } from '../../../services/recovery.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [CommonModule, DashboardCards, ExpiryAlert, QuickLinks],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
   activeTreaties = 12;
   pendingRecoveries = 5;
   expiredTreaties = [
  { id: 'T1', name: 'Treaty A', endDate: new Date('2024-12-01') },
  { id: 'T2', name: 'Treaty B', endDate: new Date('2025-01-15') }
];
constructor(private treatyService: TreatyService, private recoveryService: RecoveryService) {}
ngOnInit(): void {
  this.treatyService.list().subscribe(treaties => {
    // Count active treaties
    this.activeTreaties = treaties.filter(t => t.status === 'ACTIVE').length;

    // Map expired treaties into the simplified shape for ExpiryAlertComponent
    this.expiredTreaties = treaties
      .filter(t => t.status === 'EXPIRED')
      .map(t => ({
        id: t.treatyId,
        name: t.treatyId,
        endDate: new Date(t.endDate)   
      }));
  });

  this.recoveryService.list().subscribe(recoveries => {
    this.pendingRecoveries = recoveries.filter(r => r.status === 'PENDING').length;
  });
}


}
