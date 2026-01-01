import { Component, Input, OnInit } from '@angular/core';
import { RiskCessionService } from '../../../services/risk-cession.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-audit-log-view',
  standalone:true,
  imports: [CommonModule, DatePipe, MatCardModule, MatTableModule],
  templateUrl: './audit-log-view.html',
  styleUrl: './audit-log-view.css',
})

export class AuditLogView implements OnInit {
  @Input() cessionId!: string;
  logs: { timestamp: string; action: string; user: string }[] = [];

  constructor(private cessionService: RiskCessionService) {}

  ngOnInit(): void {
    if (this.cessionId) {
      this.cessionService.auditTrail(this.cessionId).subscribe(l => (this.logs = l));
    }
  }
}
