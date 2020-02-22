import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../models/user.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  public users: any;
  displayedColumns: string[] = ['name', 'phone', 'email', 'role', 'options'];
  dataSource: MatTableDataSource<UserModel>;
  public originalUsers: any;
  public user;
  public editable = '';
  public roles: Role[] =  [
    { value: 'CLIENT_ROLE', viewValue: 'Cliente' },
    { value: 'USER_ROLE', viewValue: 'Usuario' },
    { value: 'ADMIN_ROLE', viewValue: 'Administrador' },
  ];
  constructor(
    private _user: UserService
  ) { }

  ngOnInit() {
    this._user.getUsers().subscribe((resp: any) => {
      console.log('clientes', resp);
      localStorage.setItem('users', JSON.stringify(resp.users));
      // this.users = JSON.parse(localStorage.getItem('users'));
      // this.originalUsers = resp.users;
      this.users = resp.users;
      this.dataSource = resp.users;
      // console.log('Datasource', this.dataSource);
    }, err => {
      console.log('Error', err);
    });
  }
  setEditable(value: string, i: number) {
    console.log('Value', value);
    console.log('Index', i);
    console.log('DataSource: ', this.dataSource[i]);
    
    if (!value) {
      // console.log('Usuarios Original que cambia: ', this.users[i]);
      this.dataSource = JSON.parse(localStorage.getItem('users'));

      // this.dataSource = this.users;
    }
    this.editable = value;
  }

  deleteClient(id: string) {
    console.log('Client ID: ', id);
  }

  updateUser(user: UserModel) {
    console.log('Update user: ', user);
    this.editable = null;
  }

  trackByFn(index: any, item: any) {
    return index;
 }
}

export interface Role {
  value: string;
  viewValue: string;
}
