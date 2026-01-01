import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TreatyService } from '../../../services/treaty.service';
import { RecoveryService } from '../../../services/recovery.service';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-cards.html',
  styleUrl: './dashboard-cards.css',
})
export class DashboardCards {
// @Input() title!: string;
// @Input() value!: number;
constructor( private treatyService: TreatyService, private recoveryService: RecoveryService ) {}

 loading = true;
  summary: { activeTreaties: number; pendingRecoveries: number } | null = null;

  ngOnInit(): void { 
     const active = this.treatyService.countActiveTreaties();
      const pending = this.recoveryService.countPendingRecoveries(); 
      this.summary = { 
        activeTreaties: active, 
        pendingRecoveries: pending 
      }; 
      this.loading = false; }
}

