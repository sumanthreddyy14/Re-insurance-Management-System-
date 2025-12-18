import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Reinsurer } from '../../../models/reinsurer.model';
import { ReinsurerService } from '../../../services/reinsurer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reinsurer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatButtonModule],
  templateUrl: './reinsurer-list.html',
  styleUrl: './reinsurer-list.css',
})
export class ReinsurerList implements OnInit {
  displayedColumns = ['reinsurerId', 'name', 'contactInfo', 'actions'];
  dataSource = new MatTableDataSource<Reinsurer>([]);

  constructor(private reinsurerService: ReinsurerService) {}

  ngOnInit(): void {
    this.reinsurerService.list().subscribe(res => this.dataSource.data = res);
  }
}