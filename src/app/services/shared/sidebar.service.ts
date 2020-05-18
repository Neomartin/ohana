import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu: any = [
    {
      title: 'HOME',
      icon: 'mdi mdi-home',
      url: '/home',
      // submenu: [
      //   { title: 'Dashboard', url: '/dashboard' },
      //   { title: 'Rxjs', url: '/rxjs' }
      // ]
    },
    {
      title: 'Nueva Tarea', url: '/add-task',
      icon: 'mdi mdi-database-plus',
      // url: '/product',
      // submenu: [
        // { title: 'Autocomplete', url: '/autocomplete' },  //** Eliminar componente */
        
      // ]
    },
    { title: 'Añadir Libro', url: '/add-file', icon: 'mdi mdi-book-open-page-variant' },
    { title: 'Ordenes', url: '/orders', icon: 'mdi mdi-reorder-horizontal' },
    {
      title: 'Users',
      icon: 'mdi mdi-account-multiple',
      url: '/users',
      // submenu: [
      //   { title: 'Dashboard', url: '/dashboard' },
      //   { title: 'Rxjs', url: '/rxjs' }
      // ]
    },
    {
      title: 'PERFIL',
      icon: 'mdi mdi-account',
      url: '/profile',
      id: true
    },
    // {
    //   title: 'Login',
    //   icon: 'mdi mdi-account',
    //   url: '/login'
    // }
  ];
  constructor() { }
}
