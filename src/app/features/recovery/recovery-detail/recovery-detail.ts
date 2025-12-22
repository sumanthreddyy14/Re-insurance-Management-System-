import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Recovery } from '../../../models/recovery.model';
import { RecoveryService } from '../../../services/recovery.service';

@Component({
  selector: 'app-recovery-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,RouterLink],
  templateUrl: './recovery-detail.html',
  styleUrls: ['./recovery-detail.css']
})
export class RecoveryDetail implements OnInit {
  recovery?: Recovery;

  constructor(
    private route: ActivatedRoute,
    private recoveryService: RecoveryService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recoveryService.list().subscribe(recoveries => {
        this.recovery = recoveries.find(r => r.recoveryId === id);
      });
    }
  }
}
