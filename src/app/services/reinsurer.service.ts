import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reinsurer } from '../models/reinsurer.model';

@Injectable({ providedIn: 'root' })
export class ReinsurerService {
  private dummy: Reinsurer[] = [
    { reinsurerId: 'R001', name: 'Swiss Re', contactInfo: 'swissre@example.com' },
    { reinsurerId: 'R002', name: 'Munich Re', contactInfo: 'munichre@example.com' },
    { reinsurerId: 'R003', name: 'Hannover Re', contactInfo: 'hannoverre@example.com' }
  ];

  list(): Observable<Reinsurer[]> {
    return of(this.dummy);
  }

  getById(id: string): Observable<Reinsurer | undefined> {
    return of(this.dummy.find(r => r.reinsurerId === id));
  }
}
