import { inject, Service, signal } from '@angular/core';
import { DataBaseUtilities } from '../../../shared/utilities/data-base.utilities';
import { EmployeeModel } from './employee.model';
import { environment } from '../../../../environments/environment';

@Service()
export class EmployeeService {

    private readonly db = inject(DataBaseUtilities);

    #employees = signal<EmployeeModel[]>([]);
    employees = this.#employees.asReadonly();


    fetchEmployees(): Promise<EmployeeModel[]> {
        return this.db.fetch<EmployeeModel[]>(`${environment.apiUrl}/employee/getEmployees`, this.#employees, data => {
            return data.map((item: any) => ({
                ...item,
                fullName: `${item.firstName} ${item.lastName}`,
            }));
        });
    }

}
