import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const hasNumber = /\d/.test(control.value);
    const hasLowercase = /[a-z]/.test(control.value);
    const hasUppercase = /[A-Z]/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(control.value);

    if (!control.value || control.value.length < 8) {
      return { 'passwordInvalid': { value: control.value } };
    }
    if (!hasNumber) {
      return { 'numberInvalid': { value: control.value } };
    }
    if (!hasLowercase) {
      return { 'lowercaseInvalid': { value: control.value } };
    }
    if (!hasUppercase) {
      return { 'uppercaseInvalid': { value: control.value } };
    }
    if (!hasSpecialChar) {
      return { 'specialCharInvalid': { value: control.value } };
    }

    return null;
  };
}
