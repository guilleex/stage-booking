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
    console.log('Create employee');
  }

  editEmployee(employee: EmployeeModel): void {
    console.log('Edit employee:', employee);
  }

  changeEmployeePassword(employee: EmployeeModel): void {
    console.log('Change employee password:', employee);
  }

  deleteEmployee(employee: EmployeeModel): void {
    console.log('Delete employee:', employee);
  }

}
