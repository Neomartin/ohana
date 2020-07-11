import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, ...args: any[]): unknown {
    // console.log('value en pipe: ', value);
    // console.log('arguments pipe:', args);
    return value.slice(0, args[0] + 1 );
  }

}
