import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

import { FooterComponent } from './footer/footer.component';
import { BreadcumbsComponent } from './breadcumbs/breadcumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { UserService } from '../services/user/user.service';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    BreadcumbsComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    PipesModule,
    FlexLayoutModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    BreadcumbsComponent,
    SidebarComponent,
    HeaderComponent,
    // PipesModule
  ],
  providers: [

  ]
})
export class SharedModule { }
