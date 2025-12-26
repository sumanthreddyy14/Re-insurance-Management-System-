
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { BalanceRow, FinanceFilters, FinancialReport } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-export-button',
  standalone: true,                        // ✅ standalone component
  imports: [CommonModule, MatButtonModule],// ✅ Material button available
  templateUrl: './export-button.html',
  styleUrls: ['./export-button.css'],      // ✅ correct property name
})
export class ExportButton {
  @Input() report?: FinancialReport;
  @Input() rows?: BalanceRow[];
  @Input() title = 'Balances';
  @Input() filters?: FinanceFilters;       // ✅ used to generate report if needed

  generating = false;

  constructor(private financeService: FinanceService) {}

  export(): void {
    // 1) Export an existing report
    if (this.report) {
      this.download(this.financeService.exportReportCSV(this.report), this.report.reportId);
      return;
    }
    // 2) Export table rows
    if (this.rows && this.rows.length) {
      this.download(
        this.financeService.exportBalancesCSV(this.rows, this.title),
        this.title.replace(/\s+/g, '-').toLowerCase()
      );
      return;
    }
    // 3) Generate a report from filters, then export
    if (this.filters) {
      this.generating = true;
      this.financeService.generateReport(this.filters).subscribe({
        next: (r) => {
          this.generating = false;
          this.download(this.financeService.exportReportCSV(r), r.reportId);
        },
        error: () => (this.generating = false)
      });
    }
    // Otherwise: remain disabled by template condition
  }

  private download(blob: Blob, baseName: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
