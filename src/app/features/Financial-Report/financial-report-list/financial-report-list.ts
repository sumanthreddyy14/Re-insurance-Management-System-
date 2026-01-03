import { Component } from '@angular/core';
import { FinanceFilters, FinancialReport } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ExportButton } from '../export-button/export-button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FinanceDashboard } from '../finance-dashboard/finance-dashboard';

@Component({
  selector: 'app-financial-report-list',
 standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ExportButton,
    MatCardModule,
    MatInputModule,
    MatTableModule,   
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule, MatNativeDateModule,FinanceDashboard
  ],
  templateUrl: './financial-report-list.html',
  styleUrl: './financial-report-list.css',
})

export class FinancialReportList {
  reports: FinancialReport[] = [];
  filters: FinanceFilters = {};
  generating = false;

  // optional: provide select data in UI
  treatyId?: string;
  reinsurerId?: string;
  from?: Date; 
  to?: Date;
  constructor(private financeService: FinanceService) {
    this.financeService.listReports().subscribe(r => (this.reports = r));
  }

  displayedColumns = ['reportId', 'generatedDate', 'cededPremiums', 'recoveries', 'outstanding', 'actions'];
  errorMessage = '';

  generate(): void {
    this.errorMessage = '';
    const filters: FinanceFilters = {
      from: this.from ? this.from.toISOString() : undefined,
      to: this.to ? this.to.toISOString() : undefined,
      treatyId: this.treatyId?.trim(),
      reinsurerId: this.reinsurerId?.trim()
    };
  // Rule 1: at least one filter required
    if (!filters.from && !filters.to && !filters.treatyId && !filters.reinsurerId) {
      this.errorMessage = 'Please select at least one filter to generate a report.';
    return;
    }
    this.generating = true;
    this.financeService.generateReport(filters).subscribe({
    next: (r) => {
      this.generating = false;
      // Rule 2: no data found
      if (
        r.metrics.cededPremiums === 0 &&
        r.metrics.recoveries === 0 &&
        r.metrics.outstandingBalance === 0
      ) {
        this.errorMessage = 'Please enter valid details.';
        this.reports.shift();
      }
    },
    error: () => (this.generating = false)
    });
  }
}
