import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-cards.html',
  styleUrl: './dashboard-cards.css',
})
export class DashboardCards {
@Input() title!: string;
@Input() value!: number;
}
