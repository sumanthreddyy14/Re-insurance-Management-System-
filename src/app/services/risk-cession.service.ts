import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RiskCession } from '../models/risk-cession.model';

@Injectable({ providedIn: 'root' })
export class RiskCessionService {
  // private cessions: RiskCession[] = [];
  private cessions: RiskCession[] = [
  {
    cessionId: 'C001',
    treatyId: 'T001',
    policyId: 'P1001',
    cededPercentage: 50,
    cededPremium: 6000,
    commission: 600,
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  },
  {
    cessionId: 'C002',
    treatyId: 'T002',
    policyId: 'P1002',
    cededPercentage: 40,
    cededPremium: 3200,
    commission: 320,
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  }
];


  private policies: { policyId: string; premium: number }[] = [
    { policyId: 'P1001', premium: 12000 },
    { policyId: 'P1002', premium: 8000 },
    { policyId: 'P1003', premium: 15000 }
  ];

  private defaultCommissionRate = 0.1; // 10%

  listByTreaty(treatyId: string): Observable<RiskCession[]> {
    return of(this.cessions.filter(c => c.treatyId === treatyId));
  }

  listAll(): Observable<RiskCession[]> {
    return of(this.cessions);
  }

  getPolicyPremium(policyId: string): number | undefined {
    return this.policies.find(p => p.policyId === policyId)?.premium;
  }

  // Core allocation function
  allocateRisk(params: {
    treatyId: string;
    policyId: string;
    cededPercentage: number; // 0–100
    commissionRate?: number; // override optional
    createdBy: string;
  }): Observable<RiskCession> {
    const { treatyId, policyId, cededPercentage, commissionRate, createdBy } = params;

    // Basic validations
    if (cededPercentage <= 0 || cededPercentage > 100) {
      throw new Error('Ceded percentage must be between 0 and 100.');
    }
    const policyPremium = this.getPolicyPremium(policyId);
    if (policyPremium == null) {
      throw new Error(`Policy ${policyId} not found or missing premium.`);
    }

    
    const cededPremium = Number((policyPremium * (cededPercentage / 100)).toFixed(2));
    const rate = commissionRate ?? this.defaultCommissionRate;
    const commission = Number((cededPremium * rate).toFixed(2));

    // Generate cession record
    const cession: RiskCession = {
      cessionId: 'C' + (this.cessions.length + 1).toString().padStart(4, '0'),
      treatyId,
      policyId,
      cededPercentage,
      cededPremium,
      commission,
      createdAt: new Date().toISOString(),
      createdBy
    };

    // Persist in-memory
    this.cessions.push(cession);

    return of(cession);
  }
}
