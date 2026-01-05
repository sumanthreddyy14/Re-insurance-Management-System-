import { Component, OnInit } from '@angular/core';
import { Treaty } from '../../../models/treaty.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TreatyService } from '../../../services/treaty.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-treaty-detail',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule,QuickLinks],
  templateUrl: './treaty-detail.html',
  styleUrl: './treaty-detail.css',
})
export class TreatyDetail implements OnInit {
  treaty?: Treaty;

  constructor(private route: ActivatedRoute, private treatyService: TreatyService) {}

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.treatyService.getById(id).subscribe(t => this.treaty = t);
  }
}

}
