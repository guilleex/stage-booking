import { inject, Service, signal } from '@angular/core';
import { DataBaseUtilities } from '../../../shared/utilities/data-base.utilities';
import { UserModel } from './user.model';
import { environment } from '../../../../environments/environment';

@Service()
export class UserService {

    private readonly db = inject(DataBaseUtilities);

    #users = signal<UserModel[]>([]);
    users = this.#users.asReadonly();

    fetchUsers(): Promise<UserModel[]> {
        return this.db.fetch<UserModel[]>(`${environment.apiUrl}/user/getAllUsers`, this.#users);
    }

}
