import { Component, OnInit } from '@angular/core';
import { ComplianceService, ComplianceRules } from '../../../services/compliance.service';

import type { ComplianceIssue, AnalyticsData } from '../../../models/analytics.model';
import type { FinanceFilters } from '../../../models/finance.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../../models/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';


@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.html',
    standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule, // 👈 REQUIRED for mat-table structural directives
    MatButtonModule,
    MatFormFieldModule,
    FinanceDashboard,
    MaterialModule,
    MatChipsModule,
],
  styleUrls: ['./compliance-report.css']
})
export class ComplianceReport implements OnInit {
  issues: ComplianceIssue[] = [];
  summary = { LOW: 0, MEDIUM: 0, HIGH: 0, total: 0 };
  loading = false;
  errorMsg?: string;

  // Default filters/rules—wire to a filter bar later if needed
  filters: FinanceFilters = {
    from: '2025-01-01',
    to: '2025-12-31',
    // treatyId?: 'T001',
    // reinsurerId?: 'R001'
  };

  rules: ComplianceRules = {
    maxPendingDays: 60,         // PENDING recoveries older than 60 days => HIGH
    minUtilization: 0.30,       // Utilization below 30% => MEDIUM
    maxOutstandingPerTreaty: 0, // Outstanding balance above 0 => HIGH
    maxLossRatio: 1.2           // Loss ratio above 120% => MEDIUM/HIGH
  };

  displayedColumns = ['id', 'entityType', 'entityId', 'severity', 'detectedAt', 'message'];

  constructor(private compliance: ComplianceService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.errorMsg = undefined;

    this.compliance.listIssues(this.filters, this.rules).subscribe({
      next: (res: AnalyticsData<ComplianceIssue[]>) => {
        this.issues = res.data ?? [];
        this.summary = this.compliance.summarize(this.issues);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load compliance issues.';
        this.loading = false;
      }
    });
  }

  exportCSV(): void {
    const blob = this.compliance.exportIssuesCSV(this.issues);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'compliance_issues.csv';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }

  trackById(_: number, i: ComplianceIssue) { return i.id; }
}