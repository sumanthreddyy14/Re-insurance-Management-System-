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
    MatFormFieldModule
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
  from?: string;
  to?: string;

  displayedColumns = ['reportId', 'generatedDate', 'cededPremiums', 'recoveries', 'outstanding', 'actions'];

  constructor(private financeService: FinanceService) {
    this.financeService.listReports().subscribe(r => (this.reports = r));
  }

  generate(): void {
    this.generating = true;
    const filters: FinanceFilters = {
      from: this.from,
      to: this.to,
      treatyId: this.treatyId,
      reinsurerId: this.reinsurerId
    };
    this.financeService.generateReport(filters).subscribe({
      next: () => (this.generating = false),
      error: () => (this.generating = false)
    });
  }
}
