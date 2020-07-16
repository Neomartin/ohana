import { AbstractControl } from '@angular/forms';

export function avaibleValidator(control: AbstractControl) {

  console.log('ValidatorControl: ', control);
  return { maribel: true};
}
