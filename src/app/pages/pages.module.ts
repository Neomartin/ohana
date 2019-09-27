import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


import { TaskMenuComponent } from '../components/task-menu/task-menu.component';
import { AddFileComponent } from './add-file/add-file.component';
import { AddTaskComponent } from './add-task/add-task.component';
//Components
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from '../login/register/register.component';
import { LoginComponent } from '../login/login/login.component';
import { PAGES_ROUTES } from './pages.routes';

//Modules
import { MomentModule } from 'ngx-moment';
import {DpDatePickerModule} from 'ng2-date-picker';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


// import {MatDatepickerModule} from '@angular/material/datepicker';
//Material Modules
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrdersComponent } from './orders/orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    NotFoundComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    TaskMenuComponent,
    AddTaskComponent,
    AddFileComponent,
    OrdersComponent,
    AutocompleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PAGES_ROUTES,
    SharedModule,
    MomentModule,
    DpDatePickerModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSelectModule
  ],
  exports: [
    NotFoundComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    TaskMenuComponent

  ]
})
export class PagesModule { }
