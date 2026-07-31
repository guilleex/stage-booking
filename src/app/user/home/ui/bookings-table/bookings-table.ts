import { Component, input, signal } from '@angular/core';
import { UserBookingModel } from '../../store/user-booking.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
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

  onDeleteBooking(bookingIndex: number) {
    console.log('Delete booking at index:', bookingIndex);
    // Implement the logic to delete the booking here
  }

}
