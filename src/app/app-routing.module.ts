import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PAGES_ROUTES } from './pages/pages.routes';
import { AuthRoutingModule } from './auth/auth.routing';
// import { LoginComponent } from './login/login/login.component';


const routes: Routes = [
  // { path: 'login', component: LoginComponent, data: { title: 'Ingreso'} },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  // { path: '**', component: NotFoundComponent, data: { title: 'Pagina no encontrada ' } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PAGES_ROUTES,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
