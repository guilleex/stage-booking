import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { UserService } from '../../store/user.service';
import { UserModel } from '../../store/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.scss',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    TranslatePipe,
  ]
})
export class Users {

  private readonly userService = inject(UserService);
  private readonly paginator = viewChild(MatPaginator);
  private readonly sort = viewChild(MatSort);

  readonly users = this.userService.users;
  readonly dataSource = new MatTableDataSource<UserModel>();
  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly displayedColumns = ['fullName', 'userName', 'email', 'phone', 'active', 'actions'];

  readonly filteredUsers = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) return this.users();

    return this.users().filter(user =>
      [user.fullName, user.userName, user.email, user.phone, user.role]
        .some(value => value?.toLowerCase().includes(query))
    );
  });

  readonly mobileUsers = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  readonly activeUsers = computed(() => this.users().filter(user => user.active).length);
  readonly inactiveUsers = computed(() => this.users().length - this.activeUsers());

  constructor() {
    effect(() => {
      this.dataSource.data = this.filteredUsers();
    });

    effect(() => {
      const paginator = this.paginator();
      const sort = this.sort();
      if (paginator) this.dataSource.paginator = paginator;
      if (sort) this.dataSource.sort = sort;
    });
  }


  ngOnInit() {
    this.userService.fetchUsers();
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

  viewUser(user: UserModel): void {
    console.log('View user account:', user);
  }

  editUser(user: UserModel): void {
    console.log('Edit user account:', user);
  }

  toggleUserStatus(user: UserModel): void {
    console.log('Toggle user account status:', user);
  }
  
}
