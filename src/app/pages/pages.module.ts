import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


import { OrderPrintComponent } from '../components/order-print/order-print.component';
import { TaskMenuComponent } from '../components/task-menu/task-menu.component';
import { AddFileComponent } from './add-file/add-file.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { UsersComponent } from './users/users.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
// import { RegisterComponent } from '../login/register/register.component';
// import { LoginComponent } from '../login/login/login.component';
import { AddUserComponent } from '../components/add-user/add-user.component';
import { OrdersComponent } from '../components/orders/orders.component';
import { FilesComponent } from './files/files.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileStatisticsComponent } from '../components/profile-statistics/profile-statistics.component';
import { DialogPasswordComponent } from '../components/dialog-password/dialog-password.component';
import { SubjectTestComponent } from './subject-test/subject-test.component';
import { BranchesComponent } from './branches/branches.component';
import { AddBranchComponent } from '../components/add-branch/add-branch.component';

// Components
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { PAGES_ROUTES } from './pages.routes';

// Modules
import { MomentModule } from 'ngx-moment';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// Directives
// import { MinMaxDirective } from '../directives/min-max/min-max.directive';

// Pipes
import { PipesModule } from '../pipes/pipes.module';

// import {MatDatepickerModule} from '@angular/material/datepicker';
// Material Modules
import { CustomFormsModule } from 'ngx-custom-validators';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule} from '@angular/material/tabs';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule} from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { DialogCancelComponent } from '../components/dialog-cancel/dialog-cancel.component';




@NgModule({
  declarations: [
    NotFoundComponent,
    HomeComponent,
    // RegisterComponent,
    // LoginComponent,
    TaskMenuComponent,
    AddTaskComponent,
    AddFileComponent,
    OrdersComponent,
    AutocompleteComponent,
    FilesComponent,
    OrderPrintComponent,
    UsersComponent,
    AddUserComponent,
    ProfileComponent,
    ProfileStatisticsComponent,
    DialogPasswordComponent,
    SubjectTestComponent,
    BranchesComponent,
    AddBranchComponent,
    DialogCancelComponent
    // TruncatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PAGES_ROUTES,
    SharedModule,
    PipesModule,
    // CustomFormsModule,
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
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    NgxChartsModule,
    DragDropModule,
  ],
  exports: [
    NotFoundComponent,
    HomeComponent,
    // RegisterComponent,
    // LoginComponent,
    TaskMenuComponent,
    OrderPrintComponent,
    UsersComponent,
    ProfileComponent,
    ProfileStatisticsComponent,
    DialogPasswordComponent,
    OrdersComponent,
    FormsModule,
    ReactiveFormsModule,
    // revisar
    PipesModule,
    // FlexLayoutModule
  ],
  providers: [ PipesModule ],
  entryComponents: [AddUserComponent],
})
export class PagesModule { }
