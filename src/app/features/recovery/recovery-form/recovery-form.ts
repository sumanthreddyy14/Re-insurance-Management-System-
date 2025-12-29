import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RecoveryService } from '../../../services/recovery.service';
import { Recovery } from '../../../models/recovery.model';
import { Router, RouterLink } from '@angular/router';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-recovery-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    QuickLinks
  ],
  templateUrl: './recovery-form.html',
  styleUrls: ['./recovery-form.css']
})
export class RecoveryFormComponent {
  recoveryForm: FormGroup;

  constructor(private fb: FormBuilder, private recoveryService: RecoveryService) {
    this.recoveryForm = this.fb.group({
      claimId: ['', Validators.required],
      treatyId: ['', Validators.required],
      recoveryAmount: ['', Validators.required],
      recoveryDate: ['', Validators.required],
      status: ['PENDING', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.recoveryForm.valid) {
      const formValue = this.recoveryForm.value;
      const newRecovery: Recovery = {
        recoveryId: 'REC' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        claimId: formValue.claimId,
        treatyId: formValue.treatyId,
        recoveryAmount: formValue.recoveryAmount,
        recoveryDate: formValue.recoveryDate,
        status: formValue.status
      };

      // Push into service
      // this.recoveryService.processRecovery(newRecovery).subscribe(res => {
      //   console.log('Recovery created:', res);
      //   this.recoveryForm.reset({ status: 'PENDING' });
      // });
      console.log('Recovery created:', newRecovery);
    }
  }
}
