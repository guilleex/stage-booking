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
import { UserModel } from '../../store/user.model';

export type UserFormDialogMode = 'create' | 'edit';

export interface UserFormDialogData {
  mode: UserFormDialogMode;
  user?: UserModel;
}

export interface UserFormDialogResult {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userName: string;
  active: boolean;
  password?: string;
  roleId?: number;
  role?: string;
}

@Component({
  selector: 'app-user-form-dialog',
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
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.scss',
})
export class UserFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserFormDialog, UserFormDialogResult | undefined>);

  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  readonly isCreate = this.data.mode === 'create';
  readonly hidePassword = signal(true);
  readonly hideConfirmation = signal(true);
  readonly form = this.createForm();

  private createForm() {
    const user = this.data.user;
    const passwordValidators = this.isCreate
      ? [Validators.required, passwordStrengthValidator()]
      : [];

    return this.fb.nonNullable.group(
      {
        firstName: [user?.firstName ?? '', [Validators.required, Validators.maxLength(50)]],
        lastName: [user?.lastName ?? '', [Validators.required, Validators.maxLength(50)]],
        email: [user?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(100)]],
        phone: [user?.phone ?? '', [Validators.pattern('^[0-9+ ]*$'), Validators.minLength(9), Validators.maxLength(20)]],
        userName: [user?.userName ?? '', [Validators.required, Validators.maxLength(50)]],
        active: user?.active ?? true,
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
    const user = this.data.user;

    this.dialogRef.close({
      ...formValue,
      ...(this.isCreate ? { password } : {}),
      ...(user ? { id: user.id, roleId: user.roleId, role: user.role } : {}),
    });
  }
}