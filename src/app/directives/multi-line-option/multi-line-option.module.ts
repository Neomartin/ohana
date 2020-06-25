import { NgModule } from '@angular/core';
import { MatLineModule } from '@angular/material/core';
import { MultiLineOptionDirective } from './multi-line-option.directive';

@NgModule({
  imports: [
    MatLineModule
  ],
  declarations: [
    MultiLineOptionDirective
  ],
  exports: [
    MatLineModule,
    MultiLineOptionDirective
  ]
})
export class MultiLineOptionModule { }
