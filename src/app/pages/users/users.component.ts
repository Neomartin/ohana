import { Component, OnInit, ViewChild, Inject, ElementRef, ViewChildren } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import * as cloneDeep from 'lodash/cloneDeep';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import { AddUserComponent } from 'src/app/components/add-user/add-user.component';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  public users: any;
  formControl = new FormControl('');
  displayedColumns: string[] = ['name', 'phone', 'email', 'role', 'options'];
  dataSource;
  public originalUsers: any;
  public user;
  public editable = '';
  public roles: Role[] =  [
    { value: 'CLIENT_ROLE', viewValue: 'Cliente' },
    { value: 'USER_ROLE', viewValue: 'Usuario' },
    { value: 'ADMIN_ROLE', viewValue: 'Administrador' },
  ];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _user: UserService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }


  ngOnInit() {
    document.getElementById('name').focus();
    this.users = this._user.getUsers().subscribe((resp: any) => {
      console.log('clientes', resp);
      localStorage.setItem('users', JSON.stringify(resp.users));
      // this.users = JSON.parse(localStorage.getItem('users'));
      this.users = cloneDeep(resp.users);
      // this.originalUsers = resp.users;
      this.dataSource = new MatTableDataSource(resp.users);
      // this.dataSource = resp.users;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter: string) => {
        const transformedFilter = filter.trim().toLowerCase();
        const listAsFlatString = (obj): string => {
          let returnVal = '';
          Object.values(obj).forEach((val) => {
            if (typeof val !== 'object') {
              returnVal = returnVal + ' ' + val;
            } else if (val !== null) {
              returnVal = returnVal + ' ' + listAsFlatString(val);
            }
          });
          return returnVal.trim().toLowerCase();
        };
        return listAsFlatString(data).includes(transformedFilter);
      };
      // this.users = <UserModel> JSON.parse(JSON.stringify(resp.users));
      // console.log('Datasource', this.dataSource);
    }, err => {
      console.log('Error', err);
    });
  }
  setEditable(value: string, i: number) {
    console.log('Value', value);
    console.log('Index', i);
    if (!value) {
      // this.dataSource = JSON.parse(localStorage.getItem('users'));
      this.dataSource = cloneDeep(this.users);
    }
    console.log('Users', this.users);
    this.editable = value;
  }

  deleteClient(id: string, i: number) {
    console.log('Delete Client ID: ', id);
    console.log('Index: ', i);
    swal.fire({
      type: 'warning',
      title: 'Borrar usuario?',
      html: '<p class="text-red">Realmente desea eliminar este usuario?</p>' +
      '<img src="assets/images/trash.svg" width="120px" height="120px">'
    }).then( (result) => {
      if (result.value) {
        // this.dataSource = this.dataSource.filter( (val) => val._id !== id);
        // this.dataSource = new MatTableDataSource(cloneDeep(this.users));
        // this.dataSource.filteredData = this.dataSource.filteredData.filter( (val) => val._id !== id);
        this._user.delUser(id).subscribe( (resp) => {
          this.users.splice(i, 1);
          this.dataSource = new MatTableDataSource(cloneDeep(this.users));
          this._snackBar.open('Usuario eliminado correctamente', 'BORRADO');
        }, err => {
          this._snackBar.open('No se pudo eliminar usuario', 'ERROR');
        });
      }
    });
  }

  updateUser(user: UserModel) {
    console.log('Update user: ', user);
    swal.fire({
      type: 'info',
      title: 'Desea actualizar usuario?',
      html: `<h4> ${user.name + ' ' + user.surname}</h4>`,
      showCancelButton: true,
      confirmButtonText: 'Actualizar!',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#ffb22b',
    }).then( (result) => {
      if (result.value) {
        this._user.updUser(user._id, user).subscribe( (resp: any) => {
          console.log('UPDATE: ', resp);
        });
      }
    });
    this.editable = null;
  }

  trackByFn(index: any, item: any) {
    return index;
 }

 applyFilter(filterValue: string) {
    console.log('Entra el filter', filterValue);
    if (this.dataSource.paginator) {
      console.log('Entra al if que no se para que sirve');
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addUserDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Agregar usuario',
      description:  'Ingrese los datos del cliente o del Usuario'
    };
    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    // const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      map((data: any) => {
        if (data) {
          if (data.phone) { data.phone = [ data.phone ]; }
          data.email ? data.email = data.email.toLowerCase() : data.email = undefined;
          return data;
        } else {
          return;
        }
      }
      )
    ).subscribe( (resp: any ) => {
      if (resp) {
        this._user.newClient(resp).subscribe( (user: any) => {
          this.users.push(user.stored);
          localStorage.setItem('users', JSON.stringify(this.users));
          this.dataSource = new MatTableDataSource(cloneDeep(this.users));
            swal.fire({
              type: 'success',
              title: 'Usuario',
              html: '<p>El usuario fue creado correctamente:</p>' +
                     `<p> ${user.stored.name + ' ' + user.stored.surname }</p>`,
              timer: 2000,
              position: 'bottom-end'
            });
          });
        }
    });
  }
}

export interface Role {
  value: string;
  viewValue: string;
}
