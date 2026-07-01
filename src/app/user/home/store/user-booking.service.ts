import { Service, signal } from '@angular/core';
import { UserBookingModel } from './user-booking.model';

@Service()
export class UserBookingService {

    #userBookings = signal<UserBookingModel[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            status: 'confirmed',
            city: 'Niš',
            venue: 'Letnja pozornica',
            contactPhone: '0641234567',
            eventDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            startDate: new Date(),
            endDate: new Date(),
            status: 'pending',
            city: '',
            venue: '',
            eventDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        {
            startDate: new Date(),
            endDate: new Date(),
            status: 'rejected',
            city: '',
            venue: '',
            eventDescription: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
    ]);
    userBookings = this.#userBookings.asReadonly();

    getUserBookings(): UserBookingModel[] {
        return this.userBookings();
    }

    addUserBooking(booking: UserBookingModel): void {
        booking.status = 'pending'; // Set the status to 'pending' when adding a new booking
        this.#userBookings.set([booking, ...this.#userBookings()]);
    }

    removeUserBooking(index: number): void {
        const updatedBookings = [...this.#userBookings()];
        updatedBookings.splice(index, 1);
        this.#userBookings.set(updatedBookings);
    }
    
}
