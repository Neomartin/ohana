import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, letters: number): string {
    // return value.slice(0, letters[0] + letters );
    return  value.slice(0, letters);
  }

}
