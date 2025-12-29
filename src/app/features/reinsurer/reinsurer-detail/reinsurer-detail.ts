import { Component, OnInit } from '@angular/core';
import { Reinsurer } from '../../../models/reinsurer.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReinsurerService } from '../../../services/reinsurer.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-reinsurer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule,QuickLinks],
  templateUrl: './reinsurer-detail.html',
  styleUrl: './reinsurer-detail.css',
})
export class ReinsurerDetail implements OnInit {
  reinsurer?: Reinsurer;

  constructor(private route: ActivatedRoute, private reinsurerService: ReinsurerService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reinsurerService.getById(id).subscribe(r => this.reinsurer = r);
    }
  }
}