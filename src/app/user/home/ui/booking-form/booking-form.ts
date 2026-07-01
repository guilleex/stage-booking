import { Component, computed, EventEmitter, inject, output, Output, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import cities from '../../../../shared/data/cities.json';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';

class CityPanelErrorStateMatcher implements ErrorStateMatcher {
  constructor(private isPanelOpen: () => boolean) {}
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (this.isPanelOpen()) return false;
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
 
@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.scss',
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormField,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatInputModule,
    TranslatePipe
]
})
export class BookingForm {

  private readonly formBuilder = inject(FormBuilder);

  // @Output() formSubmit = new EventEmitter<any>();
  formSubmit = output<any>();

  form = this.formBuilder.group({
    startDate: ['', {
      validators: [Validators.required]
    }],
    endDate: ['', {
      validators: [Validators.required]
    }],
    city: ['', {
      validators: [Validators.required, Validators.maxLength(100)]
    }],
    // municipality: ['', {
    //   validators: [Validators.maxLength(100)]
    // }],
    venue: ['', {
      validators: [Validators.required, Validators.maxLength(100)]
    }],
    // companyName: ['', {
    //   validators: [Validators.maxLength(100)]
    // }],
    // contactAddress: ['', {
    //   validators: [Validators.maxLength(200)]
    // }],
    contactPhone: ['', {
      validators: [Validators.pattern("^[0-9]*$"), Validators.minLength(9)]
    }],
    eventDescription: ['', {
      validators: [Validators.required, Validators.maxLength(500)]
    }],
  });

  cities = signal(cities);
  searchText = signal('');
  autocompleteOpen = signal(false);
  workorderErrorStateMatcher = new CityPanelErrorStateMatcher(() => this.autocompleteOpen());
  citySubscription!: Subscription;

  filteredCities = computed(() => {
    const filterValue = this.searchText().toLowerCase();
    if (!filterValue) {
      return this.cities();
    }
    return this.cities().filter(city => 
      city.city.toLowerCase().startsWith(filterValue)
    );
  });

  constructor() {

  }

  ngOnInit() {
    this.citySubscription = this.form.get('city')?.valueChanges.subscribe(value => {
      this.searchText.set(value || '');
    }) as Subscription;
  }

  ngOnDestroy() {
    if (this.citySubscription) {
      this.citySubscription.unsubscribe();
    }
  }

  onCitySelected(event: any): void {
    const selectedCity = event.option.value;
    console.log('Selected city:', selectedCity);
    const cityData = this.cities().find(city => city.city === selectedCity);
    if (cityData) {
      this.form.patchValue({
        city: cityData.city
      });
    }
  }

  onAutocompletePanelOpened() {
    this.autocompleteOpen.set(true);
  }

  onAutocompletePanelClosed() {
    this.autocompleteOpen.set(false);
  }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    this.formSubmit.emit({
      formData,
      resetForm: () => {
        formDirective.resetForm();
        this.form.reset();
      }
    });
  }

}
