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
      title: 'TAREAS',
      icon: 'mdi mdi-mouse',
      // url: '/product',
      submenu: [
        { title: 'Ordenes', url: '/orders' },
        { title: 'Añadir Archivo', url: '/add-file' },
        { title: 'Nueva Tarea', url: '/add-task' },
        { title: 'Autocomplete', url: '/autocomplete' },

      ]
    },
    {
      title: 'PERFIL',
      icon: 'mdi mdi-account-multiple',
      submenu: [
        { title: 'Perfil', url: '/user-profile' },
        { title: 'Register', url: '/register' },
        { title: 'Login', url: '/login' }
      ]
    },
    // {
    //   title: 'Login',
    //   icon: 'mdi mdi-account',
    //   url: '/login'
    // }
  ];
  constructor() { }
}
