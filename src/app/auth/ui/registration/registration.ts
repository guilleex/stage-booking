import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ScreensizeService } from '../../../shared/services/screen-size/screen-size.service';
import { getValidators } from '../../../shared/utilities/data-utilities';
import { duplicateEntryValidator } from '../../../shared/validators/duplicate-entry.validator';
import { passwordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    TranslatePipe
  ]
})
export class Registration {

  private readonly fb = inject(FormBuilder);
  private readonly screenSizeSrv = inject(ScreensizeService);
  private readonly dialogRef = inject(MatDialogRef<any>);

  readonly isDesktop = this.screenSizeSrv.isDesktopSignal;

  form = this.createForm();


  /**
   * Creates the registration form with validation rules.
   * 
   * @remarks
   * The form includes fields for first name, last name, email, phone number, username, password, and confirm password.
   * Each field has appropriate validators for required fields, maximum lengths, patterns, and custom async validators.
   * The form group also includes a cross-field validator to ensure that the password and confirm password fields match.
   * 
   * @returns FormGroup
   */
  private createForm(): FormGroup {

    return this.fb.group(
      {
        firstName: ['', getValidators([Validators.required, Validators.maxLength(50)])],
        lastName: ['', getValidators([Validators.required, Validators.maxLength(50)])],
        email: ['', {
              validators: [Validators.email, Validators.maxLength(100)],
              // asyncValidators: [duplicateEntryValidator(this.userSrv, 'email')],
            }],
        phone: ['', getValidators([Validators.pattern("^[0-9]*$"), Validators.minLength(9), Validators.maxLength(15)])],
        userName: ['', {
              validators: [Validators.required, Validators.maxLength(50)],
              // asyncValidators: [duplicateEntryValidator(this.userSrv, 'userName')],
            }],
        password: ['', getValidators([Validators.required, passwordStrengthValidator()])],
        confirmPassword: ['', getValidators([Validators.required])],
      }, 
      {
        validators: [confirmPasswordValidator()]
      } as AbstractControlOptions
    );

  }

  onFormSubmit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...userData } = this.form.value;

    this.dialogRef.close(userData);
    
  }
  
}
