import { Component, OnInit, ViewChild, Inject, ElementRef, ViewChildren, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import * as cloneDeep from 'lodash/cloneDeep';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddUserComponent } from 'src/app/components/add-user/add-user.component';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from 'src/app/services/branch/branch.service';
import { Branch } from 'src/app/models/branch.model';
import { duration } from 'moment';
import { AddBranchComponent } from 'src/app/components/add-branch/add-branch.component';

export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css'],
  providers: [ BranchService ],
  encapsulation : ViewEncapsulation.None,
})
export class BranchesComponent implements OnInit {
  // branches Variables
  public title = 'SUCURSALES';
  public branches: any = undefined;
  public branch: Branch;
  // User vars

  formControl = new FormControl('');
  displayedColumns: string[] = ['name', 'adress', 'location', 'phone', 'email', 'options'];
  dataSource;
  public originalUsers: any;
  public user;
  public editable = '';
  // public roles: Role[] =  [
  //   { value: 'CLIENT_ROLE', viewValue: 'Cliente' },
  //   { value: 'USER_ROLE', viewValue: 'Usuario' },
  //   { value: 'ADMIN_ROLE', viewValue: 'Administrador' },
  // ];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _branch: BranchService,
    private _user: UserService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _router: Router
  ) {
    this.branch = new Branch('', '', '', null, true );
  }


  ngOnInit() {
    // this._user()
    this._user.user$.subscribe( (resp: any) => {
      console.log('$user:', resp );
      this.user = resp;
      // console.log('this.User: ', this.user);
    });
    // document.getElementById('name').focus();
    this.branches = this._branch.getBranches().subscribe( (resp:any) => {
      console.log('Branches: ', resp);
      this.branches = resp;
      this.dataSource = new MatTableDataSource(resp);
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


    });

  }
  // branches
  addBranch() {
    console.log('CLICKED');
  }

  setEditable(value: string, i: number) {
    console.log('Value', value);
    console.log('Index', i);
    if (!value) {
      // this.dataSource = JSON.parse(localStorage.getItem('users'));
      this.dataSource = cloneDeep(this.branches);
    }
    console.log('Users', this.branches);
    this.editable = value;
  }

  
  updateBranch(branch: any) {
    console.log('Update branch: ', branch);
    swal.fire({
      icon: 'info',
      title: 'Desea actualizar Sucursal?',
      html: `<h4> ${branch.name + ' <br><small>' + branch.adress + ' ' + branch.adress_number + '</small>'}</h4>`,
      showCancelButton: true,
      confirmButtonText: 'Actualizar!',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#ffb22b',
    }).then( (result) => {
      if (result.value) {
        this._branch.updBranch(branch._id, branch).subscribe( (resp: any) => {
        console.log('UPDATE: ', resp.updated);
        localStorage.setItem('current_branch', JSON.stringify(resp.updated));
          this._snackBar.open('Guardado correctamente!', 'GUARDADO!',  {duration: 1500, panelClass: 'branch-toast'} );
        });
      }
    });
    this.editable = null;
  }

  //   trackByFn(index: any, item: any) {
    //     return index;
    //  }

    applyFilter(filterValue: string) {
      console.log('Entra el filter', filterValue);
      if (this.dataSource.paginator) {
      console.log('Entra al if que no se para que sirve');
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addBranchDialog(branch = null, addType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Agregar Sucursal',
      description:  'Ingresar datos de la Sucursal',
      type: addType,
      branch: branch
    };
    const dialogRef = this.dialog.open(AddBranchComponent, dialogConfig);
    // const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    
    dialogRef.afterClosed().pipe(
      map((data: any) => {
        if (data) {
          // if (data.phone) { data.phone = [ data.phone ]; }
          data.email ? data.email = data.email.toLowerCase() : data.email = undefined;
          return data;
        } else {
          return;
        }
      }
      )
      ).subscribe( (resp: any ) => {
        if (resp) {
          // Request service branch
          this._branch.newBranch(resp).subscribe( (stored: any) => {
            console.log('Resp service NEW Branchitos: ', this.branches);
            this.branches.push(stored.saved);
             this.dataSource = new MatTableDataSource(cloneDeep(this.branches));
              swal.fire({
              icon: 'success',
              title: 'Usuario',
              html: '<p>El usuario fue creado correctamente:</p>' +
                    `<p class="text-info"> ${ stored.saved.name }</p>` +
                    `<small class="text-disabled"> ${ stored.saved.obs }</small>`,
              timer: 2000,
              position: 'bottom-end'
            });
          }, err => {
            console.log(err);
            swal.fire({
               icon: 'error',
               title: '<p class="text-red">No se añadió sucursal</p>',
               html: `<p> <b><b>Error:</b></b><br> ${ err.error.err.message } </p>`
            });
          });
            // this.users.push(user.stored);
            // this.dataSource = new MatTableDataSource(cloneDeep(this.users));
            // swal.fire({
            //   icon: 'success',
            //   title: 'Usuario',
            //   html: '<p>El usuario fue creado correctamente:</p>' +
            //   `<p> ${user.stored.name + ' ' + user.stored.surname }</p>`,
            //   timer: 2000,
            //   position: 'bottom-end'
            // });
          // });
        }
      });
    }
  deleteBranch(branch: Branch, i: number) {
    console.log('Delete Client ID: ', branch);
    console.log('Index: ', i);
    swal.fire({
      icon: 'warning',
      title: 'Borrar Sucursal?',
      html: '<p class="text-red">Realmente desea eliminar esta sucursal?</p>' +
            `<p> ${ branch.name }</p>` +
            '<img src="assets/images/trash.svg" width="120px" height="120px">',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancelar!',
      cancelButtonColor: '#dd3333',
    }).then( (result) => {
      if (result.value) {
        this._branch.delete(branch._id).subscribe( (resp) => {
          console.log('Respusta de Delete: ', resp);
          this.branches.splice(i, 1);
          this.dataSource = new MatTableDataSource(cloneDeep(this.branches));
          this._snackBar.open('Sucursal eliminada correctamente', 'ELIMINADA');
        }, err => {
          this._snackBar.open('No se pudo eliminar usuario', 'ERROR');
        });
      }
    });
  }

  // Button disable para ir al perfil de usuario o dado el caso a la sucursal
  // viewClient(id) {
  //   this._router.navigate(['/profile/' + id]);
  // }

}

