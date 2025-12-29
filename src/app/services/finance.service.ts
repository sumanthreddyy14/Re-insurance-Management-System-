
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';

import {
  FinanceFilters,
  FinancialMetrics,
  FinancialReport,
  BalanceRow,
  Recovery,
  RecoveryStatus
} from '../models/finance.model';

import { RiskCessionService } from './risk-cession.service';
import { TreatyService } from './treaty.service';
import { Treaty } from '../models/treaty.model';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  // In-memory registry for generated reports (used by report list)
  private readonly _reports$ = new BehaviorSubject<FinancialReport[]>([]);

  // In-memory recoveries store (self-contained so you don’t need an extra service file)
  private readonly _recoveries$ = new BehaviorSubject<Recovery[]>([
    {
      recoveryId: 'R0001',
      claimId: 'C1001',
      treatyId: 'T001',
      recoveryAmount: 1500,
      recoveryDate: new Date().toISOString(),
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      recoveryId: 'R0002',
      claimId: 'C1002',
      treatyId: 'T002',
      recoveryAmount: 800,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }
  ]);

  constructor(
    private cessionService: RiskCessionService,
    private treatyService: TreatyService
  ) {}

 
  getSummary(filters?: FinanceFilters): Observable<FinancialMetrics> {
    return this.computeMetrics(filters).pipe(map(ctx => ctx.totals));
  }

  getBalanceTable(
    filters: FinanceFilters = {},
    groupBy: 'reinsurer' | 'treaty' = 'reinsurer'
  ): Observable<BalanceRow[]> {
    return this.computeMetrics(filters).pipe(
      map(({ byTreaty, byReinsurer, treatyIndex }) => {
        if (groupBy === 'treaty') {
          return Object.entries(byTreaty).map(([treatyId, m]) => ({
            key: treatyId,
            label: treatyId,
            cededPremiums: m.cededPremiums,
            recoveries: m.recoveries,
            outstandingBalance: m.outstandingBalance
          }));
        }
        // Default grouping: by reinsurer
        return Object.entries(byReinsurer).map(([reinsurerId, m]) => {
          const treatiesForReinsurer = Object.keys(treatyIndex)
            .filter(tid => treatyIndex[tid]?.reinsurerId === reinsurerId);
          const reinsurerName =
            treatyIndex[treatiesForReinsurer[0]]?.reinsurerName ?? reinsurerId;
          return {
            key: reinsurerId,
            label: reinsurerName,
            cededPremiums: m.cededPremiums,
            recoveries: m.recoveries,
            outstandingBalance: m.outstandingBalance,
            treaties: treatiesForReinsurer
          };
        });
      })
    );
  }

 
  generateReport(filters: FinanceFilters = {}): Observable<FinancialReport> {
    return this.computeMetrics(filters).pipe(
      map(({ totals, byTreaty, byReinsurer }) => {
        const report: FinancialReport = {
          reportId: 'FR' + Date.now(),
          generatedDate: new Date().toISOString(),
          period: filters.from || filters.to ? { from: filters.from, to: filters.to } : undefined,
          treatyId: filters.treatyId,
          reinsurerId: filters.reinsurerId,
          metrics: totals,
          breakdown: { byTreaty, byReinsurer }
        };
        this._reports$.next([report, ...this._reports$.value]);
        return report;
      })
    );
  }


  listReports(): Observable<FinancialReport[]> {
    return this._reports$.asObservable();
  }

  exportReportCSV(report: FinancialReport): Blob {
    const lines: string[] = [];
    lines.push(`Report ID,${report.reportId}`);
    lines.push(`Generated,${report.generatedDate}`);
    if (report.period) {
      lines.push(`From,${report.period.from ?? ''}`);
      lines.push(`To,${report.period.to ?? ''}`);
    }
    if (report.treatyId) lines.push(`Treaty,${report.treatyId}`);
    if (report.reinsurerId) lines.push(`Reinsurer,${report.reinsurerId}`);
    lines.push('');

    lines.push('Totals');
    lines.push(`Ceded Premiums,${fmt(report.metrics.cededPremiums)}`);
    lines.push(`Recoveries,${fmt(report.metrics.recoveries)}`);
    lines.push(`Outstanding,${fmt(report.metrics.outstandingBalance)}`);
    lines.push('');

    lines.push('Breakdown by Treaty');
    lines.push('Treaty ID,Ceded Premiums,Recoveries,Outstanding');
    const bt = report.breakdown?.byTreaty ?? {};
    for (const tid of Object.keys(bt)) {
      const m = bt[tid];
      lines.push(`${tid},${fmt(m.cededPremiums)},${fmt(m.recoveries)},${fmt(m.outstandingBalance)}`);
    }
    lines.push('');
    lines.push('Breakdown by Reinsurer');
    lines.push('Reinsurer ID,Ceded Premiums,Recoveries,Outstanding');
    const br = report.breakdown?.byReinsurer ?? {};
    for (const rid of Object.keys(br)) {
      const m = br[rid];
      lines.push(`${rid},${fmt(m.cededPremiums)},${fmt(m.recoveries)},${fmt(m.outstandingBalance)}`);
    }
    return new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  }

  exportBalancesCSV(rows: BalanceRow[], title = 'Balances'): Blob {
    const lines: string[] = [];
    lines.push(title);
    lines.push('Key,Label,Ceded Premiums,Recoveries,Outstanding,Treaties');
    for (const r of rows) {
      lines.push(
        `${r.key},${san(r.label)},${fmt(r.cededPremiums)},${fmt(r.recoveries)},${fmt(r.outstandingBalance)},${(r.treaties ?? []).join('|')}`
      );
    }
    return new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  }

  listRecoveries(): Observable<Recovery[]> {
    return this._recoveries$.asObservable();
  }

  addRecovery(rec: Omit<Recovery, 'recoveryId' | 'createdAt'>): Observable<Recovery> {
    const newRec: Recovery = {
      ...rec,
      recoveryId: 'R' + (this._recoveries$.value.length + 1).toString().padStart(4, '0'),
      createdAt: new Date().toISOString()
    };
    this._recoveries$.next([...this._recoveries$.value, newRec]);
    return of(newRec);
  }

  updateRecoveryStatus(id: string, status: RecoveryStatus): Observable<Recovery | undefined> {
    const arr = [...this._recoveries$.value];
    const idx = arr.findIndex(r => r.recoveryId === id);
    if (idx < 0) return of(undefined);
    const updated = { ...arr[idx], status };
    if (status === 'COMPLETED') {
      updated.recoveryDate = new Date().toISOString();
    }
    arr[idx] = updated;
    this._recoveries$.next(arr);
    return of(updated);
  }

  listRecoveriesByTreaty(treatyId: string): Observable<Recovery[]> {
    return of(this._recoveries$.value.filter(r => r.treatyId === treatyId));
  }

  listRecoveriesByStatus(status: RecoveryStatus): Observable<Recovery[]> {
    return of(this._recoveries$.value.filter(r => r.status === status));
  }

  seedRecoveriesFromCessions({ replace = false }: { replace?: boolean } = {}): Observable<Recovery[]> {
    return combineLatest([this.cessionService.listAll(), this.treatyService.list()]).pipe(
      map(([cessions, treaties]) => {
        const synthetic: Recovery[] = cessions.map((c, idx) => ({
          recoveryId: 'SR' + (idx + 1).toString().padStart(3, '0'),
          claimId: 'SC' + (idx + 1001),
          treatyId: c.treatyId,
          policyId: c.policyId,
          recoveryAmount: c.cededPremium,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          createdBy: 'system'
        }));

        const current = this._recoveries$.value;
        const next = replace ? synthetic : [...current, ...synthetic.filter(sr => !current.some(c => c.recoveryId === sr.recoveryId))];
        this._recoveries$.next(next);
        return next;
      })
    );
  }

  private computeMetrics(filters: FinanceFilters = {}): Observable<{
    totals: FinancialMetrics;
    byTreaty: Record<string, FinancialMetrics>;
    byReinsurer: Record<string, FinancialMetrics>;
    treatyIndex: Record<string, { reinsurerId?: string; reinsurerName?: string }>;
  }> {
    const recoveries$ = this.listRecoveries();

    return combineLatest([
      this.cessionService.listAll(), // RiskCession[]
      recoveries$,                   // Recovery[]
      this.treatyService.list()      // Treaty[]
    ]).pipe(
      map(([cessions, recoveries, treaties]) => {
        const treatyById = new Map<string, Treaty>(treaties.map(t => [t.treatyId, t]));

        const inRange = (iso?: string) =>
          (!filters.from && !filters.to) ||
          (!!iso && (!filters.from || iso >= filters.from) && (!filters.to || iso <= filters.to));

        // Filter cessions by treaty/reinsurer/date
        const filteredCessions = cessions.filter(c => {
          const tm = !filters.treatyId || c.treatyId === filters.treatyId;
          const rid = (treatyById.get(c.treatyId) as any)?.reinsurerId;
          const rm = !filters.reinsurerId || rid === filters.reinsurerId;
          const dm = inRange(c.createdAt);
          return tm && rm && dm;
        });

        // Filter recoveries by treaty/reinsurer/date
        const filteredRecoveries = recoveries.filter(r => {
          const tm = !filters.treatyId || r.treatyId === filters.treatyId;
          const rid = (treatyById.get(r.treatyId) as any)?.reinsurerId;
          const rm = !filters.reinsurerId || rid === filters.reinsurerId;
          const dateForRange = r.recoveryDate ?? r.createdAt ?? '';
          const dm = inRange(dateForRange);
          return tm && rm && dm;
        });

        // Totals
        const cededPremiums = round2(sum(filteredCessions.map(c => c.cededPremium)));
        // Treat COMPLETED as received
        const recoveriesReceived = round2(
          sum(filteredRecoveries.filter(r => r.status === 'COMPLETED').map(r => r.recoveryAmount))
        );
        const outstandingBalance = round2(cededPremiums - recoveriesReceived);

        // Breakdown by treaty
        const byTreaty: Record<string, FinancialMetrics> = {};
        filteredCessions.forEach(c => {
          const key = c.treatyId;
          byTreaty[key] ??= emptyMetrics();
          byTreaty[key].cededPremiums = round2(byTreaty[key].cededPremiums + c.cededPremium);
        });
        filteredRecoveries
          .filter(r => r.status === 'COMPLETED')
          .forEach(r => {
            const key = r.treatyId;
            byTreaty[key] ??= emptyMetrics();
            byTreaty[key].recoveries = round2(byTreaty[key].recoveries + r.recoveryAmount);
          });
        Object.keys(byTreaty).forEach(k => {
          const m = byTreaty[k];
          m.outstandingBalance = round2(m.cededPremiums - m.recoveries);
        });

        // Breakdown by reinsurer
        const byReinsurer: Record<string, FinancialMetrics> = {};
        filteredCessions.forEach(c => {
          const rid = (treatyById.get(c.treatyId) as any)?.reinsurerId ?? 'UNKNOWN';
          byReinsurer[rid] ??= emptyMetrics();
          byReinsurer[rid].cededPremiums = round2(byReinsurer[rid].cededPremiums + c.cededPremium);
        });
        filteredRecoveries
          .filter(r => r.status === 'COMPLETED')
          .forEach(r => {
            const rid = (treatyById.get(r.treatyId) as any)?.reinsurerId ?? 'UNKNOWN';
            byReinsurer[rid] ??= emptyMetrics();
            byReinsurer[rid].recoveries = round2(byReinsurer[rid].recoveries + r.recoveryAmount);
          });
        Object.keys(byReinsurer).forEach(k => {
          const m = byReinsurer[k];
          m.outstandingBalance = round2(m.cededPremiums - m.recoveries);
        });

        // Index for labels
        const treatyIndex: Record<string, { reinsurerId?: string; reinsurerName?: string }> = {};
        treaties.forEach(t => {
          treatyIndex[t.treatyId] = {
            reinsurerId: (t as any).reinsurerId,
            reinsurerName: (t as any).reinsurerName
          };
        });

        return {
          totals: { cededPremiums, recoveries: recoveriesReceived, outstandingBalance },
          byTreaty,
          byReinsurer,
          treatyIndex
        };
      })
    );
  }
}


function sum(nums: number[]) { return nums.reduce((a, b) => a + b, 0); }
function round2(n: number) { return Math.round(n * 100) / 100; }
function fmt(n: number) { return round2(n).toFixed(2); }
function san(s: string) { return (s ?? '').replace(/,/g, ' '); }
function emptyMetrics(): FinancialMetrics {
  return { cededPremiums: 0, recoveries: 0, outstandingBalance: 0 };
}