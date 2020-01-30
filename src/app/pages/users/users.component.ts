import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../models/user.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  public users: UserModel[];
  displayedColumns: string[] = ['name', 'phone', 'email', 'role', 'options'];
  dataSource: MatTableDataSource<any>;
  public editable = '';
  constructor(
    private _user: UserService
  ) { }

  ngOnInit() {
    this._user.getUsers().subscribe((resp: any) => {
      console.log('clientes', resp);
      this.users = resp.users;
      this.dataSource = resp.users;
    }, err => {
      console.log('Error', err);
    });
  }
  setEditable(value: string) {
    console.log('Value', value);
    // console.log('Index', index);
    this.editable = value;
  }
  deleteClient(id: string) {
    console.log('Client ID: ', id);
  }

  updateUser(user: UserModel) {
    console.log('Update user: ', user);
  }

  trackByFn(index: any, item: any) {
    return index;
 }
}
