import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from '../services/guards/login.guard';
// import { AdminGuard } from '../services/guards/admin.guard';

// Components
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    {   
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuard ],
        canLoad: [ LoginGuard],
        loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule )
    },
    // { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: '**', component: NotFoundComponent, data: { title: 'Pagina no encontrada'} },
];

export const PAGES_ROUTES = RouterModule.forChild( routes );
