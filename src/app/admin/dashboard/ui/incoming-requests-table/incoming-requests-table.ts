import { Component, inject, input, output } from '@angular/core';
import { BookingRequestModel } from '../../store/dashboard-data.models';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-incoming-requests-table',
  templateUrl: './incoming-requests-table.html',
  styleUrl: './incoming-requests-table.scss',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    TranslatePipe
  ]
})
export class IncomingRequestsTable {

  incomingRequests = input.required<BookingRequestModel[]>();

  readonly displayedColumns = ['userFullName', 'startDate', 'endDate', 'city', 'venue', 'contactPhone', 'eventDescription', 'actions'];

  reqToAccept = output<BookingRequestModel>();
  reqToReject = output<BookingRequestModel>();

  openAcceptRequestDialog(request: BookingRequestModel) {
    this.reqToAccept.emit(request);
  }

  openRejectRequestDialog(request: BookingRequestModel) {
    this.reqToReject.emit(request);
  }

}
