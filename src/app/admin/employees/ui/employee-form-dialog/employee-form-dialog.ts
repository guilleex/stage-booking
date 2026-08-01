import { Component, inject, signal } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password.validator';
import { passwordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { EmployeeModel } from '../../store/employee.model';

export type EmployeeFormDialogMode = 'create' | 'edit';

export interface EmployeeFormDialogData {
  mode: EmployeeFormDialogMode;
  employee?: EmployeeModel;
}

export interface EmployeeFormDialogResult {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  active: boolean;
  password?: string;
  roleId?: number;
  role?: string;
}

@Component({
  selector: 'app-employee-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    TranslatePipe,
  ],
  templateUrl: './employee-form-dialog.html',
  styleUrl: './employee-form-dialog.scss',
})
export class EmployeeFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EmployeeFormDialog, EmployeeFormDialogResult | undefined>);

  readonly data = inject<EmployeeFormDialogData>(MAT_DIALOG_DATA);
  readonly isCreate = this.data.mode === 'create';
  readonly hidePassword = signal(true);
  readonly hideConfirmation = signal(true);
  readonly form = this.createForm();

  private createForm() {
    const employee = this.data.employee;
    const passwordValidators = this.isCreate
      ? [Validators.required, passwordStrengthValidator()]
      : [];

    return this.fb.nonNullable.group(
      {
        firstName: [employee?.firstName ?? '', [Validators.required, Validators.maxLength(50)]],
        lastName: [employee?.lastName ?? '', [Validators.required, Validators.maxLength(50)]],
        email: [employee?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(100)]],
        phone: [employee?.phone ?? '', [Validators.pattern('^[0-9+ ]*$'), Validators.minLength(9), Validators.maxLength(20)]],
        username: [employee?.username ?? '', [Validators.required, Validators.maxLength(50)]],
        active: employee?.active ?? true,
        password: ['', passwordValidators],
        confirmPassword: ['', this.isCreate ? [Validators.required] : []],
      },
      {
        validators: this.isCreate ? [confirmPasswordValidator()] : [],
      } as AbstractControlOptions,
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, password, ...formValue } = this.form.getRawValue();
    const employee = this.data.employee;

    this.dialogRef.close({
      ...formValue,
      ...(this.isCreate ? { password } : {}),
      ...(employee ? { id: employee.id, roleId: employee.roleId, role: employee.role } : {}),
    });
  }
}