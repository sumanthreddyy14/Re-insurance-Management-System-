import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { FinanceSummary } from '../finance-summary/finance-summary';
import { BalanceTable } from '../balance-table/balance-table';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-finance-dashboard',
  standalone:true,
  imports: [CommonModule, MatCardModule,RouterLink],
  templateUrl: './finance-dashboard.html',
  styleUrl: './finance-dashboard.css',
})
export class FinanceDashboard {
constructor(private router: Router) {}
 
  onLogout() {
 
  this.router.navigate(['/login']);
  }
 
}
