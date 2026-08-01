import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { UserModel } from '../../store/user.model';

export interface UserPasswordResetDialogResult {
  userId: number;
  email: string;
}

@Component({
  selector: 'app-user-password-reset-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, TranslatePipe],
  templateUrl: './user-password-reset-dialog.html',
  styleUrl: './user-password-reset-dialog.scss',
})
export class UserPasswordResetDialog {
  private readonly dialogRef = inject(MatDialogRef<UserPasswordResetDialog, UserPasswordResetDialogResult | undefined>);

  readonly user = inject<UserModel>(MAT_DIALOG_DATA);
  readonly email = this.user.email?.trim() ?? '';
  readonly canReset = this.email.length > 0;

  onConfirm(): void {
    if (!this.canReset) return;

    this.dialogRef.close({
      userId: this.user.id,
      email: this.email,
    });
  }
}