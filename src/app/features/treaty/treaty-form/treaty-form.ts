import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { TreatyService } from '../../../services/treaty.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-treaty-form',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './treaty-form.html',
  styleUrl: './treaty-form.css',
})
export class TreatyForm {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private treatyService: TreatyService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      treatyId: ['', Validators.required],
      reinsurerName: ['', Validators.required],
      treatyType: ['', Validators.required],
      coverageLimit: [0, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.treatyService.getById(id).subscribe(t => {
        if (t) {
          this.form.patchValue(t); // ✅ pre-fill form fields
        }
      });
    }
  }

  save(): void {
    if (this.form.valid) {
      const treaty = this.form.value;
      console.log('Saving treaty', treaty);
    }
  }
}
