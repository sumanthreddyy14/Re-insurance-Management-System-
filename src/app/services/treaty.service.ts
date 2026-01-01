// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Treaty } from '../models/treaty.model';

// @Injectable({ providedIn: 'root' })
// export class TreatyService {
//   constructor(private http: HttpClient) {}

//   list(): Observable<Treaty[]> {
//     return this.http.get<Treaty[]>('/api/treaties');
//   }
// }
// treaty.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Treaty } from '../models/treaty.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TreatyService {
  constructor(private http: HttpClient) {}
  private dummy: Treaty[] = [
    {
      treatyId: 'T001',
      reinsurerId: 'R001',
      reinsurerName: 'Hari NTR',
      treatyType: 'PROPORTIONAL',
      coverageLimit: 5000000,
      startDate: '2025-01-01',
      endDate: '2026-01-31',
      status: 'ACTIVE',
      renewalDate: '2025-12-15'
    },

    {
      treatyId: 'T002',
      reinsurerId: 'R002',
      reinsurerName: 'Ramu',
      treatyType: 'NON-PROPORTIONAL',
      coverageLimit: 3000000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'EXPIRED',
      renewalDate: '2026-01-15'
    },
    {
      treatyId: 'T003',
      reinsurerId: 'R003',
      reinsurerName: 'John',
      treatyType: 'PROPORTIONAL',
      coverageLimit: 7000000,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'ARCHIVED',
      renewalDate: '2024-10-15'
    },
    {
      treatyId: 'T004',
      reinsurerId: 'R004',
      reinsurerName: 'Sumanth',
      treatyType: 'PROPORTIONAL',
      coverageLimit: 80000000,
      startDate: '2025-01-01',
      endDate: '2026-01-31',
      status: 'ACTIVE',
      renewalDate: '2026-01-15'
    }
  ];

  list(): Observable<Treaty[]> {
    return of(this.dummy);
  }

  getById(id: string): Observable<Treaty | undefined> {
    return of(this.dummy.find(t => t.treatyId === id));
  }
}
