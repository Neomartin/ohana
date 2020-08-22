import { NgModule } from '@angular/core';
import { TruncatePipe } from './truncate.pipe';
import { AccessLevelPipe } from './access-level.pipe';



@NgModule({
  declarations: [
    TruncatePipe,
    AccessLevelPipe
  ],
  imports: [
  ],
  exports: [
    TruncatePipe,
    AccessLevelPipe
  ]
})
export class PipesModule { }
