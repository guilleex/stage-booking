import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/store/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrl: './account.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
  ]
})
export class Account {

  private readonly authSrv = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authSrv.logout();
    this.router.navigateByUrl('/login');
  }

}
