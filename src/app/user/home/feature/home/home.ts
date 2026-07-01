import { Component, inject, signal } from '@angular/core';
import { BookingForm } from '../../ui/booking-form/booking-form';
import { UserBookingService } from '../../store/user-booking.service';
import { BookingsTable } from '../../ui/bookings-table/bookings-table';
import { I18nService } from '../../../../shared/services/i18n/i18n.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [
    BookingForm,
    BookingsTable
  ]
})
export class Home {

  private readonly userBookingSrv = inject(UserBookingService);
  private readonly i18n = inject(I18nService);
  private readonly toastSrv = inject(ToastService);

  bookings = this.userBookingSrv.userBookings;

  ngOnInit() {
    this.userBookingSrv.getUserBookings();
  }

  onSubmit(formData: any): void {
    console.log('Form submitted with data:', formData);

    try {
      this.userBookingSrv.addUserBooking(formData.formData);
      this.toastSrv.onSuccess(this.i18n.translate('MESSAGE.BOOKING_REQUEST_SUBMITTED'));
      formData.resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error('Error adding user booking:', error);
      this.toastSrv.onError(this.i18n.translate('error.error'), this.i18n.translate('error.pleaseTryAgain'));
    }

  }

}
