import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar, MatDatepickerModule, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BookingService } from '../../store/booking.service';
import { I18nService } from '../../../../shared/services/i18n/i18n.service';
import { TranslatePipe } from '@ngx-translate/core';
import { IncomingRequestsTable } from '../../ui/incoming-requests-table/incoming-requests-table';
import { BookingRequestModel } from '../../store/dashboard-data.models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AcceptRequestDialog } from '../../ui/accept-request-dialog/accept-request-dialog';
import { RejectRequestDialog } from '../../ui/reject-request-dialog/reject-request-dialog';
import { ScreensizeService } from '../../../../shared/services/screen-size/screen-size.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatDatepickerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    IncomingRequestsTable,
    TranslatePipe
  ]
})
export class Dashboard {

  private readonly bookingService = inject(BookingService);
  private readonly i18n = inject(I18nService);
  private readonly dialog = inject(MatDialog);
  private readonly screenSizeSrv = inject(ScreensizeService);
  private readonly calendar = viewChild(MatCalendar<Date>);

  readonly isDesktop = this.screenSizeSrv.isDesktopSignal;

  bookingRequests = this.bookingService.bookingRequests;
  acceptedRequests = this.bookingService.acceptedRequests;
  pendingRequests = this.bookingService.pendingRequests;
  daysWithStatus = this.bookingService.daysWithStatus;

  // Flip to true once the fetch resolves so the calendar mounts with data already present.
  readonly daysLoaded = signal(false);

  constructor() {
    effect((onCleanup) => {
      const calendar = this.calendar();
      if (!calendar) return;

      let visibleMonth = this.toMonthKey(calendar.activeDate);
      const subscription = calendar.stateChanges.subscribe(() => {
        const nextVisibleMonth = this.toMonthKey(calendar.activeDate);
        if (nextVisibleMonth === visibleMonth) return;

        visibleMonth = nextVisibleMonth;
        this.logSelectedMonth(calendar.activeDate);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }


  summaryCards = computed(() => {
    const acceptedCount = this.acceptedRequests().length;
    const pendingCount = this.pendingRequests().length;
    return [
      { label: this.i18n.translate('LABEL.ACCEPTED'), value: acceptedCount, icon: 'check_circle', tone: 'success' },
      { label: this.i18n.translate('LABEL.PENDING'), value: pendingCount, icon: 'schedule', tone: 'warning' },
    ];
  });

  statusLegend = computed(() => [
    // { label: 'Accepted', status: 'free' as const, icon: 'event_available' },
    { label: this.i18n.translate('LABEL.ACCEPTED'), status: 'free' as const, icon: 'event_available' },
    { label: this.i18n.translate('LABEL.PENDING'), status: 'pending' as const, icon: 'hourglass_top' }
  ]);

  readonly displayedColumns = ['userFullName', 'from', 'to', 'city', 'location', 'phone', 'description', 'actions'];

  readonly dashboardRequests: BookingRequestModel[] = [
    {
      userFullName: 'Ana Petrović',
      startDate: new Date(2026, 6, 3),
      endDate: new Date(2026, 6, 5),
      city: 'Belgrade',
      venue: 'Ada Hall',
      contactPhone: '+381 64 111 222',
      eventDescription: 'Corporate summer event with stage, sound, and LED wall.',
      status: 'pending',
    },
    {
      userFullName: 'Marko Ilić',
      startDate: new Date(2026, 6, 8),
      endDate: new Date(2026, 6, 8),
      city: 'Novi Sad',
      venue: 'Arena Center',
      contactPhone: '+381 64 333 444',
      eventDescription: 'Concert setup with quick turnaround and overnight teardown.',
      status: 'booked',
    },
    {
      userFullName: 'Jelena Stanković',
      startDate: new Date(2026, 6, 11),
      endDate: new Date(2026, 6, 12),
      city: 'Niš',
      venue: 'City Plaza',
      contactPhone: '+381 64 555 666',
      eventDescription: 'Wedding celebration with ceremony area and reception stage.',
      status: 'pending',
    },
    {
      userFullName: 'Nemanja Jovanović',
      startDate: new Date(2026, 6, 16),
      endDate: new Date(2026, 6, 18),
      city: 'Kragujevac',
      venue: 'Open Air Park',
      contactPhone: '+381 64 777 888',
      eventDescription: 'Festival booking with multiple artists and frequent changeovers.',
      status: 'free',
    },
  ];

  // readonly statusDays = [
  //   { date: new Date(2026, 6, 1), status: 'free' as const },
  //   { date: new Date(2026, 6, 2), status: 'pending' as const },
  //   { date: new Date(2026, 6, 3), status: 'booked' as const },
  //   { date: new Date(2026, 6, 4), status: 'booked' as const },
  //   { date: new Date(2026, 6, 8), status: 'pending' as const },
  //   { date: new Date(2026, 6, 11), status: 'free' as const },
  //   { date: new Date(2026, 6, 16), status: 'booked' as const },
  //   { date: new Date(2026, 6, 18), status: 'pending' as const },
  //   { date: new Date(2026, 6, 22), status: 'free' as const },
  //   { date: new Date(2026, 6, 24), status: 'booked' as const },
  // ] as const;

  readonly dayClass = computed<MatCalendarCellClassFunction<Date>>(() => {
    const days = this.daysWithStatus();
    return (date) => {
      const match = days.find(day => this.toKey(day.date as Date) === this.toKey(date));
      return match ? ['status-day', `status-day--${match.status}`] : [];
    };
  });

  private logSelectedMonth(activeDate: Date): void {
    const month = activeDate.toLocaleString(undefined, {
      month: 'long',
      year: 'numeric'
    });

    console.log('Selected calendar month:', month, {
      month: activeDate.getMonth() + 1,
      year: activeDate.getFullYear()
    });
  }

  private toMonthKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  ngOnInit() {
    this.bookingService.fetchBookingRequests().then(requests => {
      console.log('Fetched booking requests:', requests);
    }).catch(error => {
      console.error('Error fetching booking requests:', error);
    });

    this.bookingService.fetchDaysWithStatus().then(days => {
      console.log('Fetched days with status:', days);
    }).catch(error => {
      console.error('Error fetching days with status:', error);
    }).finally(() => {
      this.daysLoaded.set(true);
    });
  }

  openAcceptRequestDialog(request: BookingRequestModel) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'req-dialog';
    dialogConfig.autoFocus = false;
    dialogConfig.data = request;

    const dialogRef = this.dialog.open(AcceptRequestDialog, {
      ...dialogConfig,
      width:     !this.isDesktop() ? '100vw'  : '680px',
      maxWidth:  !this.isDesktop() ? '100vw'  : '90vw',
      height:    !this.isDesktop() ? '100dvh' : 'auto',
      maxHeight: !this.isDesktop() ? '100dvh' : '90dvh'
    });

    dialogRef.afterClosed().subscribe(resData => {
        if (resData) console.log('Accept request dialog closed with data:', resData);
    });
  }

  openRejectRequestDialog(request: BookingRequestModel) {

    const dialogRef = this.dialog.open(RejectRequestDialog, {
      panelClass: 'req-dialog',
      autoFocus: false,
      data: request,
      width:     !this.isDesktop() ? '100vw'  : '680px',
      maxWidth:  !this.isDesktop() ? '100vw'  : '90vw',
      height:    !this.isDesktop() ? '100dvh' : 'auto',
      maxHeight: !this.isDesktop() ? '100dvh' : '90dvh'
    });

    dialogRef.afterClosed().subscribe(resData => {
        if (resData) console.log('Reject request dialog closed with data:', resData);
    });

  }

  private toKey(date: Date): string {
    return new Date(date).toDateString();
  }
}
