import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Recovery } from '../../../models/recovery.model';
import { RecoveryService } from '../../../services/recovery.service';
import { StatusBadge } from '../status-badge/status-badge';


@Component({
  selector: 'app-recovery-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatButtonModule,StatusBadge],
  templateUrl: './recovery-list.html',
  styleUrls: ['./recovery-list.css']
})
export class RecoveryList implements OnInit {
  displayedColumns = ['recoveryId', 'claimId', 'treatyId', 'recoveryAmount', 'recoveryDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Recovery>([]);

  constructor(private recoveryService: RecoveryService) {}

ngOnInit(): void {
  this.recoveryService.list().subscribe(res => {
    console.log('Recoveries:', res); // should log derived recoveries
    this.dataSource.data = res;
  });
}

}
