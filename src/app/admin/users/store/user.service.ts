import { inject, Service, signal } from '@angular/core';
import { DataBaseUtilities } from '../../../shared/utilities/data-base.utilities';
import { UserModel } from './user.model';
import { environment } from '../../../../environments/environment';

type UserApiModel = Omit<UserModel, 'fullName' | 'userName'> & {
    fullName?: string;
    userName?: string;
    username?: string;
};

@Service()
export class UserService {

    private readonly db = inject(DataBaseUtilities);

    #users = signal<UserModel[]>([]);
    users = this.#users.asReadonly();

    fetchUsers(): Promise<UserModel[]> {
        return this.db.fetch<UserModel[]>(`${environment.apiUrl}/user/getAllUsers`, this.#users, (data: UserApiModel[]) =>
            data.map(user => ({
                ...user,
                userName: user.userName ?? user.username ?? '',
                fullName: user.fullName ?? `${user.firstName} ${user.lastName}`.trim(),
            }))
        );
    }

}
