import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingComponent } from '../../../shared/ui/loading/loading.component';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../../shared/services/i18n/i18n.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { ScreensizeService } from '../../../shared/services/screen-size/screen-size.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Registration } from '../../ui/registration/registration';
import { PasswordReset } from '../../ui/password-reset/password-reset';
import { AuthService } from '../../store/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { RegisterUserData } from '../../store/auth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    LoadingComponent,
    TranslatePipe
]
})
export class Auth {

  private readonly i18n = inject(I18nService);
  private readonly loadingSrv = inject(LoadingService);
  private readonly fb = inject(FormBuilder);
  private readonly screenSizeSrv = inject(ScreensizeService);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastSrv = inject(ToastService);

  readonly isDesktop = this.screenSizeSrv.isDesktopSignal;

  form = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  openRegistrationDialog(): void {

    const isMobile = !this.screenSizeSrv.isDesktopSignal();

    const dialogRef = this.dialog.open(Registration, {
      panelClass: ['custom-dialog', 'registration-dialog'],
      autoFocus: false,
      width:     isMobile ? '100vw'  : '680px',
      maxWidth:  isMobile ? '100vw'  : '90vw',
      height:    isMobile ? '100dvh' : 'auto',
      maxHeight: isMobile ? '100dvh' : '90dvh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Registration data:', result);
      }
    });

  }

  forgotPassword(): void {
    const isMobile = !this.screenSizeSrv.isDesktopSignal();

    this.dialog.open(PasswordReset, {
      panelClass: 'password-reset-dialog',
      autoFocus: false,
      width: isMobile ? 'calc(100vw - 2rem)' : '29rem',
      maxWidth: isMobile ? 'calc(100vw - 2rem)' : '90vw',
      maxHeight: 'calc(100dvh - 2rem)',
      ariaLabelledBy: 'password-reset-title'
    });
  }

  async onRegister(userData: RegisterUserData): Promise<void> {

    try {
      await this.authService.register(userData);
      const { userName, password } = userData;
      await this.onLogin(userName, password);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.returnInt <= 0
        ? this.i18n.translate('ERROR.REGISTRATION_FAILED') 
        : this.i18n.translate('ERROR.UNKNOWN_ERROR');
      this.toastSrv.onError(errorMessage);
    }

  }
  
  async onSubmit(): Promise<void> {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {userName, password} = this.form.value;
    this.onLogin(userName as string, password as string);
    
  }
  
  /**
   * Handles the login process by calling the AuthService with the provided username and password.
   * 
   * @param userName 
   * @param password 
   */
  private async onLogin(userName: string, password: string) {
    
    try {
      await this.authService.login(userName, password);

      const roleId = this.authService.user()?.roleId;

      switch (roleId) {
        case 1:
          this.router.navigate(['/admin/dashboard']);
          break;
        case 2:
          this.router.navigate(['/user/home']);
          break;
        default:
          this.router.navigate(['employee/calendar']);
          break;
      }

      this.toastSrv.clear();
      this.form.reset();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.returnInt) {
        const errorMessage = error.returnInt <= 0
          ? this.i18n.translate('ERROR.BAD_CREDENTIALS') 
          : this.i18n.translate('ERROR.UNKNOWN_ERROR');
    
        this.toastSrv.onError(errorMessage);
      }
    }

  }

}
