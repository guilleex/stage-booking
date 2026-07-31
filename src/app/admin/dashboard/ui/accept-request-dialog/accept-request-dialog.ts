import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BookingRequestModel } from '../../store/dashboard-data.models';

@Component({
  selector: 'app-accept-request-dialog',
  templateUrl: './accept-request-dialog.html',
  styleUrl: './accept-request-dialog.scss',
  imports: [
    DatePipe,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    TranslatePipe
  ]
})
export class AcceptRequestDialog {

  private readonly dialogRef = inject(MatDialogRef<AcceptRequestDialog, BookingRequestModel | undefined>);
  readonly data = inject<BookingRequestModel>(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
