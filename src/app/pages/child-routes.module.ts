import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { LoginGuard } from '../services/guards/login.guard';
import { AdminGuard } from '../services/guards/admin.guard';

// Components
import { HomeComponent } from './home/home.component';


import { AddTaskComponent } from './add-task/add-task.component';
import { AddFileComponent } from './add-file/add-file.component';
import { OrdersComponent } from '../components/orders/orders.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileStatisticsComponent } from '../components/profile-statistics/profile-statistics.component';
import { SubjectTestComponent } from './subject-test/subject-test.component';
import { BranchesComponent } from './branches/branches.component';


const childRoutes: Routes = [
  { path: 'home', canActivate: [ AdminGuard ] , component: OrdersComponent, data: { title: 'Home'} },
  { path: 'orders', component: OrdersComponent, data: { title: 'Ordenes'}},
  { path: 'autocomplete', component: AutocompleteComponent, data: { title: 'Autocomplete'}},
  { path: 'test', component: OrdersComponent, data: { title: 'Test component'}},
  { path: 'statistics', component: ProfileStatisticsComponent, data: { title: 'Perfil del Usuario'}},
  { path: 'profile/:id', component: ProfileComponent, data: { title: 'Perfil del Usuario'}},
  { path: '', component: OrdersComponent, data: { title: 'Página Principal '} },


  // Admin routes & Tier access
  { path: 'users', canActivate: [ AdminGuard ], component: UsersComponent, 
    data: { title: 'Usuarios', tier: 1 }
  },
  { path: 'users/:id', component: UsersComponent, data: { title: 'Usuario'}},
  { path: 'add-task/:id', component: AddTaskComponent, data: { title: 'Añadir/Quitar Tarea'} },
  { path: 'add-task', component: AddTaskComponent, data: { title: 'Añadir/Quitar Tarea'} },
  { path: 'add-file', component: AddFileComponent, data: { title: 'Añadir o Quitar Archivo'}},
  { path: 'branches', canActivate: [ AdminGuard ], component: BranchesComponent,
    data: { title: 'Administración de Sucursales', tier: 4 }
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(childRoutes),
  ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
