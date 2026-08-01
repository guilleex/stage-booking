import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { UserModel } from '../../store/user.model';

@Component({
  selector: 'app-delete-user-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, TranslatePipe],
  templateUrl: './delete-user-dialog.html',
  styleUrl: './delete-user-dialog.scss',
})
export class DeleteUserDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteUserDialog, UserModel | undefined>);

  readonly user = inject<UserModel>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(this.user);
  }
}