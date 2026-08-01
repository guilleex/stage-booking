import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { EmployeeService } from '../../store/employee.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { EmployeeModel } from '../../store/employee.model';
import { MatDialog } from '@angular/material/dialog';
import { ScreensizeService } from '../../../../shared/services/screen-size/screen-size.service';
import { EmployeeFormDialog, EmployeeFormDialogData } from '../../ui/employee-form-dialog/employee-form-dialog';
import { EmployeePasswordDialog } from '../../ui/employee-password-dialog/employee-password-dialog';
import { DeleteEmployeeDialog } from '../../ui/delete-employee-dialog/delete-employee-dialog';

@Component({
  selector: 'app-employees',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TranslatePipe,
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees {

  private readonly employeeService = inject(EmployeeService);
  private readonly dialog = inject(MatDialog);
  private readonly screenSizeSrv = inject(ScreensizeService);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  readonly employees = this.employeeService.employees;
  readonly dataSource = new MatTableDataSource<EmployeeModel>();
  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly displayedColumns = ['fullName', 'username', 'role', 'email', 'phone', 'active', 'actions'];

  readonly filteredEmployees = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) return this.employees();

    return this.employees().filter(employee =>
      [employee.fullName, employee.username, employee.role, employee.email, employee.phone]
        .some(value => value?.toLowerCase().includes(query))
    );
  });

  readonly mobileEmployees = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredEmployees().slice(start, start + this.pageSize());
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.employees();
      this.dataSource.filter = this.searchTerm().trim().toLowerCase();
    });

    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();
      if (paginator) this.dataSource.paginator = paginator;
      if (sort) this.dataSource.sort = sort;
    });
  }

  ngOnInit() {
    this.employeeService.fetchEmployees();
  }

  applyFilter(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
    this.paginator()?.firstPage();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  createEmployee(): void {
    this.openEmployeeFormDialog({ mode: 'create' });
  }

  editEmployee(employee: EmployeeModel): void {
    this.openEmployeeFormDialog({ mode: 'edit', employee });
  }

  changeEmployeePassword(employee: EmployeeModel): void {
    const isMobile = !this.screenSizeSrv.isDesktopSignal();

    this.dialog.open(EmployeePasswordDialog, {
      panelClass: ['employee-dialog-panel', 'employee-compact-dialog-panel'],
      autoFocus: false,
      data: employee,
      width: isMobile ? 'calc(100vw - 1.5rem)' : '32rem',
      maxWidth: isMobile ? 'calc(100vw - 1.5rem)' : '90vw',
      maxHeight: 'calc(100dvh - 1.5rem)',
      ariaLabelledBy: 'employee-password-title',
    });
  }

  deleteEmployee(employee: EmployeeModel): void {
    const isMobile = !this.screenSizeSrv.isDesktopSignal();

    this.dialog.open(DeleteEmployeeDialog, {
      panelClass: ['employee-dialog-panel', 'employee-compact-dialog-panel'],
      autoFocus: false,
      data: employee,
      width: isMobile ? 'calc(100vw - 1.5rem)' : '30rem',
      maxWidth: isMobile ? 'calc(100vw - 1.5rem)' : '90vw',
      maxHeight: 'calc(100dvh - 1.5rem)',
      ariaLabelledBy: 'delete-employee-title',
    });
  }

  private openEmployeeFormDialog(data: EmployeeFormDialogData): void {
    const isMobile = !this.screenSizeSrv.isDesktopSignal();

    this.dialog.open(EmployeeFormDialog, {
      panelClass: ['employee-dialog-panel', 'employee-form-dialog-panel'],
      autoFocus: false,
      data,
      width: isMobile ? '100vw' : '45rem',
      maxWidth: isMobile ? '100vw' : '90vw',
      height: isMobile ? '100dvh' : 'auto',
      maxHeight: isMobile ? '100dvh' : '90dvh',
      ariaLabelledBy: 'employee-form-title',
    });
  }

}
