import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/store/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IdleService } from '../../shared/services/idle/idle.service';
import { I18nService } from '../../shared/services/i18n/i18n.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthModel, RefreshTokenApiResponse } from '../../auth/store/auth.model';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { HasRoleDirective } from '../../shared/directives/has-role/has-role.directive';
import { ShowOnMobileDirective } from '../../shared/directives/show-on-mobile/show-on-mobile.directive';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    HasRoleDirective,
    ShowOnMobileDirective,
  ]
})
export class Main {

  private readonly authSrv = inject(AuthService);
  private readonly router = inject(Router);
  private readonly idle = inject(IdleService);
  private readonly i18n = inject(I18nService);
  private readonly toastSrv = inject(ToastService);

  user = this.authSrv.user;
  private previousAuthState = false;
  private activeLogoutTimer: any;
  private readonly destroy$ = new Subject<void>();
  language = this.i18n.language;

  constructor() {        
    this.initializeComponent();
  }

  ngOnDestroy() {    
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {

    if (!this.user() && this.previousAuthState !== !!this.user()) {
      this.router.navigateByUrl('/login');
    }      
    
    this.previousAuthState = !!this.user();       
    
    this.setIdleTimer();

    if (!!this.user()) {
      this.checkRefreshToken(this.user() as AuthModel);
      this.idle.watch();
    } else {
      this.idle.stop();
    }
    
  }

  private async checkRefreshToken(user: AuthModel): Promise<void> {  

    if (!user.tokenExpirationDate || user.tokenExpirationDate <= new Date()) {

      try {

        const userRefreshTokenApiResponse = await this.authSrv.refreshToken(user);
        const newUserData = this.authSrv.setUserAfterTokenRefresh(
          userRefreshTokenApiResponse as RefreshTokenApiResponse,
          user
        ); 

        this.autoLogout(newUserData.tokenDuration, newUserData);

      } catch (error) {

        this.logout();

      }

    } else {

      const tokenDuration = new Date(user.tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(tokenDuration, user);

    }  
  } 

  private autoLogout(duration: number, user: AuthModel): void {     

    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

    this.activeLogoutTimer = setTimeout(() => {
      this.authSrv.refreshToken(user).then((refreshTokenApiResponse) => {
        const userData = this.authSrv.setUserAfterTokenRefresh(
          refreshTokenApiResponse as RefreshTokenApiResponse, 
          user as AuthModel
        );
        this.autoLogout(userData.tokenDuration, userData);        
      }).catch(() => this.logout());
    }, duration);
  }

  logout(): void {
    // Stop idle timer before logout to prevent Zone errors
    // this.idle.stop();
    // if (this.activeLogoutTimer) {
    //   clearTimeout(this.activeLogoutTimer);
    // }
    this.authSrv.logout();
    this.router.navigateByUrl('/login');
  }

  private setIdleTimer() {
    this.idle.setIdle(1199);
    this.idle.setTimeout(1);

    this.idle.onIdleEnd.pipe(takeUntil(this.destroy$)).subscribe(() => this.idle.watch());
    this.idle.onTimeout.pipe(takeUntil(this.destroy$)).subscribe(() => this.logout());
  }

}
