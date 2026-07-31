import { Component, inject } from '@angular/core';
import { UserService } from '../../store/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.scss',
  imports: [

  ]
})
export class Users {

  private readonly userService = inject(UserService);


  ngOnInit() {
    this.userService.fetchUsers().then((users) => {
      console.log('Fetched users:', users);
    }).catch((error) => {
      console.error('Error fetching users:', error);
    });
  }
  
}
