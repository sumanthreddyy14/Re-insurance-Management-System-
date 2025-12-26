import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quick-links',
  standalone: true, 
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.css',
})
export class QuickLinks {

}
