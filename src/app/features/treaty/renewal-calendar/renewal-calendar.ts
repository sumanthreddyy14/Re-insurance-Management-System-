import { Component, OnInit } from '@angular/core';
import { Treaty } from '../../../models/treaty.model';
import { TreatyService } from '../../../services/treaty.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-renewal-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule,MatChipsModule],
  templateUrl: './renewal-calendar.html',
  styleUrl: './renewal-calendar.css',
})
export class RenewalCalendar implements OnInit {
  upcomingRenewals: Treaty[] = [];

  constructor(private treatyService: TreatyService) {}

  ngOnInit(): void {
    this.treatyService.list().subscribe(treaties => {
    const today = new Date();
    this.upcomingRenewals = treaties.filter(t => {
    const end = new Date(t.endDate);
    const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    console.log(t.treatyId, t.endDate, diff); // ✅ debug
    return diff >= 0 && diff <= 90;
  });
});

  }
}