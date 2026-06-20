import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map, from, switchMap, debounceTime, of } from "rxjs";

/**
 * Creates an async validator function that checks for duplicate entries in the database.
 * Validates that the entered value doesn't already exist for the specified property,
 * excluding the initial value (useful for edit scenarios).
 * 
 * @param srv - Service instance that provides the valueRegistered method for checking duplicates.
 * @param property - The property name to check for duplicates (e.g., 'email', 'username').
 * @param initialValue - Optional initial value to exclude from duplicate checking (for edit mode).
 * @returns {AsyncValidatorFn} Angular async validator function that returns validation errors or null.
 * 
 * @example
 * ```typescript
 * // For new user creation
 * email: ['', [Validators.email], [duplicateEntryValidator(userService, 'email')]]
 * 
 * // For editing existing user
 * email: ['', [Validators.email], [duplicateEntryValidator(userService, 'email', user.email)]]
 * ```
 */
export function duplicateEntryValidator(srv: any, property: string, initialValue?: string): AsyncValidatorFn {
  
  /**
   * The actual validator function that gets called by Angular Forms.
   * 
   * @param control - The form control being validated.
   * @returns Observable that emits validation errors object or null if valid.
   */
  return (control: AbstractControl) => {
        
    // Skip validation if value matches initial value or is empty
    if (initialValue === control.value || !control.value) return from([null]);

    console.log(control.value);
    
    
    // Create observable stream to check for duplicates
    return of(control.value).pipe(
      switchMap(value => {
        // Call service method to check if value already exists
        return srv.valueRegistered(value, property);
      }),
      map(resData => {        
        // Return validation error if duplicate exists, null if unique
        return resData ? {elementExists:true} : null;
      })
    );

  };

}
