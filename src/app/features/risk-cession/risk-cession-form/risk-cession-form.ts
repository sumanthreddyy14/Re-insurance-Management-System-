import { Component } from '@angular/core';
import { Treaty } from '../../../models/treaty.model';
import { RiskCessionService } from '../../../services/risk-cession.service';
import { TreatyService } from '../../../services/treaty.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-risk-cession-form',
  standalone: true,
  imports: [
    CommonModule,
    QuickLinks,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './risk-cession-form.html',
  styleUrl: './risk-cession-form.css',
})
export class RiskCession {
  treaties: Treaty[] = [];
  policies = ['P1001', 'P1002', 'P1003']; // from service later
  selectedTreatyId = '';
  selectedPolicyId = '';
  cededPercentage = 0;
  commissionRate = 0.1; // optional override
  lastResult?: { cededPremium: number; commission: number; cessionId: string };

  constructor(private cessionService: RiskCessionService, private treatyService: TreatyService) {
    this.treatyService.list().subscribe(t => (this.treaties = t.filter(tt => tt.status === 'ACTIVE')));
  }

  allocate(): void {
    if (!this.selectedTreatyId || !this.selectedPolicyId || this.cededPercentage <= 0) return;
    this.cessionService
      .allocateRisk({
        treatyId: this.selectedTreatyId,
        policyId: this.selectedPolicyId,
        cededPercentage: this.cededPercentage,
        commissionRate: this.commissionRate,
        createdBy: 'admin'
      })
      .subscribe(res => {
        this.lastResult = { cededPremium: res.cededPremium, commission: res.commission ?? 0, cessionId: res.cessionId };
        // Reset percentage for convenience
        this.cededPercentage = 0;
      });
  }
}