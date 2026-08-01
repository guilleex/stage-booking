import { Component, inject, signal } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password.validator';
import { passwordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { EmployeeModel } from '../../store/employee.model';

export interface EmployeePasswordDialogResult {
  employeeId: string;
  password: string;
}

@Component({
  selector: 'app-employee-password-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatePipe,
  ],
  templateUrl: './employee-password-dialog.html',
  styleUrl: './employee-password-dialog.scss',
})
export class EmployeePasswordDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EmployeePasswordDialog, EmployeePasswordDialogResult | undefined>);

  readonly employee = inject<EmployeeModel>(MAT_DIALOG_DATA);
  readonly hidePassword = signal(true);
  readonly hideConfirmation = signal(true);
  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [confirmPasswordValidator()],
    } as AbstractControlOptions,
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({
      employeeId: this.employee.id,
      password: this.form.controls.password.value,
    });
  }
}