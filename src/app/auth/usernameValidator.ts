import { AbstractControl, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const hasLetter = /[a-zA-Z]/.test(control.value);

    if (!control.value || control.value.length < 1) {
      return { 'lengthTooShort': { value: control.value } };
    }
    if(!control.value || control.value.length > 20) {
      return { 'lengthTooLong': { value: control.value } };
    }
    if (!hasLetter) {
      return { 'letterInvalid': { value: control.value } };
    }

    return null;
  };
}
