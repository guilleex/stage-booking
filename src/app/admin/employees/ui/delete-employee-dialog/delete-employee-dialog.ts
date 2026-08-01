import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { EmployeeModel } from '../../store/employee.model';

@Component({
  selector: 'app-delete-employee-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, TranslatePipe],
  templateUrl: './delete-employee-dialog.html',
  styleUrl: './delete-employee-dialog.scss',
})
export class DeleteEmployeeDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteEmployeeDialog, EmployeeModel | undefined>);

  readonly employee = inject<EmployeeModel>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(this.employee);
  }
}