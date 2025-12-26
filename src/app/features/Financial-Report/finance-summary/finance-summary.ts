import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FinanceFilters, FinancialMetrics } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-finance-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, DecimalPipe],
  templateUrl: './finance-summary.html',
  styleUrl: './finance-summary.css',
})

export class FinanceSummary implements OnChanges {
  @Input() filters: FinanceFilters = {};
  summary?: FinancialMetrics;
  loading = false;

  constructor(private financeService: FinanceService) {}

  
  ngOnInit(): void {
    // Ensure initial load
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.fetch();
    }
  }

  fetch(): void {
    this.loading = true;
    this.financeService.getSummary(this.filters).subscribe({
      next: metrics => {
        this.summary = metrics;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}