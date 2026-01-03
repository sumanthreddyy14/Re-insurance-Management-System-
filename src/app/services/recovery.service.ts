// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { Recovery } from '../models/recovery.model';

// @Injectable({ providedIn: 'root' })
// export class RecoveryService {
//   private recoveries: Recovery[] = [
//     {
//       recoveryId: 'R001',
//       claimId: 'C1001',
//       treatyId: 'T001',
//       recoveryAmount: 50000,
//       recoveryDate: '2025-12-01T00:00:00',
//       status: 'PENDING'
//     },
//     {
//       recoveryId: 'R002',
//       claimId: 'C1002',
//       treatyId: 'T002',
//       recoveryAmount: 75000,
//       recoveryDate: '2025-11-15T00:00:00',
//       status: 'COMPLETED'
//     }
//   ];

//   list(): Observable<Recovery[]> {
//     return of(this.recoveries);
//   }

//   getById(id: string): Observable<Recovery | undefined> {
//     return of(this.recoveries.find(r => r.recoveryId === id));
//   }

//   add(recovery: Recovery): Observable<Recovery> {
//     this.recoveries.push(recovery);
//     return of(recovery);
//   }

//   updateStatus(id: string, status: 'PENDING' | 'COMPLETED'): Observable<Recovery | undefined> {
//     const rec = this.recoveries.find(r => r.recoveryId === id);
//     if (rec) rec.status = status;
//     return of(rec);
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Recovery } from '../models/recovery.model';
import { TreatyService } from './treaty.service';
import { RiskCessionService } from './risk-cession.service';
import { RiskCession } from '../models/risk-cession.model';
import { Treaty } from '../models/treaty.model';

@Injectable({ providedIn: 'root' })
export class RecoveryService {
  private recoveries: Recovery[] = [];
  private recoveries$ = new BehaviorSubject<Recovery[]>([]);
  constructor(
    private treatyService: TreatyService,
    private cessionService: RiskCessionService
  ) {}

  list(): Observable<Recovery[]> {
    return combineLatest([
      this.treatyService.list(),
      this.cessionService.listAll()
    ]).pipe(
      map(([treaties, cessions]) => {
        const recoveries: Recovery[] = [];

        cessions.forEach((c: RiskCession, index: number) => {
          const treaty: Treaty | undefined = treaties.find(t => t.treatyId === c.treatyId);

          if (treaty) {
            recoveries.push({
              recoveryId: 'REC' + (index + 1).toString().padStart(3, '0'),
              claimId: 'C' + (index + 1001), 
              treatyId: treaty.treatyId,
              recoveryAmount: c.cededPremium, 
              recoveryDate: new Date().toISOString(),
              status: 'PENDING'
            });
          }
        });
        this.recoveries = recoveries;
        this.recoveries$.next(this.recoveries);
        return recoveries;
      })
    );
  }

 countPendingRecoveries(): number { 
  return this.recoveries.filter((r: Recovery) => r.status === 'PENDING').length; 
}
flagDispute(id: string): void {
  const rec = this.recoveries.find(r => r.recoveryId === id);
  if (rec) {
    rec.status = 'DISPUTED';
    this.recoveries$.next([...this.recoveries]);
  }
}
getRecoveries(): Observable<Recovery[]> { 
  return this.recoveries$.asObservable(); 
}
getById(id: string): Recovery | undefined { 
  return this.recoveries.find(r => r.recoveryId === id); 
}

  
}
