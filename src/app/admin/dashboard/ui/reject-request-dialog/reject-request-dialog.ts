import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingRequestModel } from '../../store/dashboard-data.models';

@Component({
  selector: 'app-reject-request-dialog',
  templateUrl: './reject-request-dialog.html',
  styleUrl: './reject-request-dialog.scss',
  imports: [
    DatePipe,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    TranslatePipe
  ]
})
export class RejectRequestDialog {

  private readonly dialogRef = inject(MatDialogRef<RejectRequestDialog, BookingRequestModel | undefined>);
  readonly data = inject<BookingRequestModel>(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }
  
}
