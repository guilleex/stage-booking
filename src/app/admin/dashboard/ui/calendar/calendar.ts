import { Component } from '@angular/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  imports: [
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class Calendar {}
