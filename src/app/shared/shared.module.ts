import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';

import { FooterComponent } from './footer/footer.component';
import { BreadcumbsComponent } from './breadcumbs/breadcumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';

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
    MatSelectModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    BreadcumbsComponent,
    SidebarComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
