import { Component, input, signal } from '@angular/core';
import { UserBookingModel } from '../../store/user-booking.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-bookings-table',
  templateUrl: './bookings-table.html',
  styleUrl: './bookings-table.scss',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    NgClass,
    DatePipe,
    TranslatePipe
  ]
})
export class BookingsTable {

  bookings = input.required<UserBookingModel[]>();
  displayedColumns = signal(['status', 'startDate', 'endDate', 'city', 'venue', 'actions']);

  ngOnInit() { 

    console.log('BookingsTable initialized with bookings:', this.bookings());
  }

  onDeleteBooking(bookingId: string) {
    console.log('Delete booking with ID:', bookingId);
    // Implement the logic to delete the booking here
  }

}
