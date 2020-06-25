import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from '../login/login/login.component';
import { UsersComponent } from './users/users.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginGuard } from '../services/guard/login.guard';
import { AddTaskComponent } from './add-task/add-task.component';
import { AddFileComponent } from './add-file/add-file.component';
import { OrdersComponent } from './orders/orders.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileStatisticsComponent } from '../components/profile-statistics/profile-statistics.component';
import { SubjectTestComponent } from './subject-test/subject-test.component';

const routes: Routes = [
    {   path: '',
        component: PagesComponent,
        canActivate: [ LoginGuard ],
        children: [
            { path: 'home', component: HomeComponent, data: { title: 'HomeComponent'} },
            { path: 'orders', component: OrdersComponent, data: { title: 'Ordenes'}},
            { path: 'users', component: UsersComponent, data: { title: 'Usuarios'}},
            { path: 'users/:id', component: UsersComponent, data: { title: 'Usuario'}},
            { path: 'add-task/:id', component: AddTaskComponent, data: { title: 'Añadir/Quitar Tarea'} },
            { path: 'add-task', component: AddTaskComponent, data: { title: 'Añadir/Quitar Tarea'} },
            { path: 'add-file', component: AddFileComponent, data: { title: 'Añadir o Quitar Archivo'}},
            { path: 'autocomplete', component: AutocompleteComponent, data: { title: 'Autocomplete'}},
            { path: 'profile/:id', component: ProfileComponent, data: { title: 'Perfil del Usuario'}},
            { path: 'statistics', component: ProfileStatisticsComponent, data: { title: 'Perfil del Usuario'}},
            { path: 'test', component: SubjectTestComponent, data: { title: 'Test component'}},
            { path: '', redirectTo: '/home', pathMatch: 'full'},
        ]
    },
    { path: 'login', component: LoginComponent, data: { title: 'Ingreso'} },
    { path: '**', component: NotFoundComponent, data: { title: 'Pagina no encontrada'} },
];

export const PAGES_ROUTES = RouterModule.forChild( routes );
