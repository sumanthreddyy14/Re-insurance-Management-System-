// import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BalanceRow, FinanceFilters } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FinanceDashboard } from '../finance-dashboard/finance-dashboard';

@Component({
  selector: 'app-balance-table',
 standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,        
    MatButtonModule,
    MatFormFieldModule
  ],

  templateUrl: './balance-table.html',
  styleUrl: './balance-table.css',
})

export class BalanceTable implements OnChanges {
  @Input() filters: FinanceFilters = {};
  @Input() groupBy: 'reinsurer' | 'treaty' = 'reinsurer';

  @Output() rowsChanged = new EventEmitter<BalanceRow[]>();

  rows: BalanceRow[] = [];
  displayedColumns = ['label', 'cededPremiums', 'recoveries', 'outstanding', 'treaties'];
  loading = false;

  constructor(private financeService: FinanceService) {}
  
  ngOnInit(): void {
    this.load(); // <-- fetch rows at startup
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] || changes['groupBy']) {
      this.load();
    }
  }

  load(): void {
    this.loading = true;
    this.financeService.getBalanceTable(this.filters, this.groupBy).subscribe({
      next: rows => {
        this.rows = rows;
        this.rowsChanged.emit(rows);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
