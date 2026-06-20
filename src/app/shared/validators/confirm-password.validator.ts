import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';


export function confirmPasswordValidator() {

    return (formGroup: FormGroup) : ValidationErrors | null | undefined => {      

      const sourceCtrl = formGroup.controls['password'];
      const targetCtrl = formGroup.controls['confirmPassword'];

      if (targetCtrl.errors && !targetCtrl.errors['mustMatch']) {
        return;
      }

      if (targetCtrl.errors && !targetCtrl.errors['required'] && targetCtrl.errors['mustMatch']) {
        targetCtrl.setErrors({ mustMatch: true });
        return;
      }

      if (sourceCtrl.value !== targetCtrl.value) {
        targetCtrl.setErrors({ mustMatch: true });
      } else {
        targetCtrl.setErrors(null);
      }
      return null;

    }
    
}
