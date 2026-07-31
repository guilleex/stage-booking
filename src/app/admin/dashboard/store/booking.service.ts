import { computed, inject, Injectable, signal } from '@angular/core';
import { DataBaseUtilities } from '../../../shared/utilities/data-base.utilities';
import { BookingRequestModel, BookingStatusDayModel } from './dashboard-data.models';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {

    private readonly db = inject(DataBaseUtilities);

    #bookingRequests = signal<BookingRequestModel[]>([]);
    bookingRequests = this.#bookingRequests.asReadonly();

    acceptedRequests = computed(() => this.bookingRequests().filter(request => request.status === 'Accepted'));
    pendingRequests = computed(() => this.bookingRequests().filter(request => request.status === 'Pending'));

    #daysWithStatus = signal<BookingStatusDayModel[]>([]);
    daysWithStatus = this.#daysWithStatus.asReadonly();

    /**
     * Fetches booking requests from the API and updates the bookingRequests signal.
     * @returns Promise resolving to the fetched booking requests.
     */
    fetchBookingRequests(): Promise<BookingRequestModel[]> {
        return this.db.fetch<BookingRequestModel[]>(`${environment.apiUrl}/bookings/getAllRequests`, this.#bookingRequests, data => {
            return data.map((item: any) => ({
                ...item,
                startDate: new Date(item.startDate),
                endDate: new Date(item.endDate)
            }));
        });
    }


    fetchDaysWithStatus(): Promise<BookingStatusDayModel[]> {
        return this.db.fetch<BookingStatusDayModel[]>(`${environment.apiUrl}/bookings/getDaysWithStatus`, this.#daysWithStatus, data => {
            return data.map((item: any) => ({
                ...item,
                status: String(item.status).toLowerCase(),
                date: new Date(item.date)
            }));
        });
    }
    
}
