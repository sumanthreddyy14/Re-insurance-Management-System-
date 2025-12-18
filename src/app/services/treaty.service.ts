import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Treaty } from '../models/treaty.model';

@Injectable({ providedIn: 'root' })
export class TreatyService {
  constructor(private http: HttpClient) {}

  list(): Observable<Treaty[]> {
    return this.http.get<Treaty[]>('/api/treaties');
  }
}
