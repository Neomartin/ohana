import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog } from '@angular/material/dialog';
import swal from 'sweetalert2';


import { UserService } from 'src/app/services/user/user.service';
import { ProfileStatisticsComponent } from 'src/app/components/profile-statistics/profile-statistics.component';
import { DialogPasswordComponent } from 'src/app/components/dialog-password/dialog-password.component';
import { UserModel } from 'src/app/models/user.model';
import { Branch } from 'src/app/models/branch.model';
import { BranchService } from 'src/app/services/branch/branch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ BranchService ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  public localUser;
  public user;
  public userId;
  public id: String = null;
  public routeSubscription: Subscription;
  branches: Array<Branch>;
  userBranchUpdate: Boolean = false;
  linked_branches = [];
  avaiable_branches = [];
  @ViewChild(ProfileStatisticsComponent, { static: false }) charts;
  constructor(
    private _user: UserService,
    private _branch: BranchService,
    public _dialog: MatDialog,
    public _route: ActivatedRoute,
    public _router: Router
  ) {}

  ngOnInit() {
    // Subscribe para detectar cambios en los parametros al usar la misma ruta
    this.routeSubscription = this._route.params.subscribe((val: any) => {
      const firstRoute = val.id;
      this.getUser(firstRoute);
    });
    this.localUser = JSON.parse(localStorage.getItem('user'));
    this.id = this._route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getUser(this.id);
    } else {
      this.user = this.localUser;
    }
  }

  getUser(id: String) {
    this._user.getUsers(id).subscribe( (resp: any) => {
      this.user = resp;
      this.linked_branches = resp.user.branch;
      this._branch.getBranches().subscribe( (response: [Branch]) => {
        this.branches = response;
        this.avaiable_branches = response;
        const tempito = this.linked_branches.map(x => x._id);
        this.avaiable_branches = this.branches.filter((val: any) => {
          return !tempito.includes(val._id);
        });
      });
    });
  }

  onTabChange(e) {
    // this.charts.saludar();
    if (document.getElementById('sta') ) {
      this.charts.changeView([document.getElementById('sta').offsetWidth]);
    }
  }
  updateUser(id) {
    this._user.updUser(id, this.user.user)
      .subscribe( (resp: any) => {
      this.user.user = resp.updated;
      if (id === this.localUser.user._id) {
        console.log('Updated CURRENT User', resp.updated);
        this.localUser.user = resp.updated;
      }
    });
    swal.fire({
       icon: 'success',
       title: 'Actualizado!',
       html: 'El usuario fue actualizado correctamente',
    });
  }
  passwordChange(): void {
    const dialogRef = this._dialog.open(DialogPasswordComponent, {
      data: { id: this.id, otrodato: 'Hola' }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    // });
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log('Evento de drag and drop');
    // console.log(event.container.data);
    // console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
    }
    // this.user.user.branch = this.linked_branches;
    this.user.user.branch = [];
    this.linked_branches.forEach( (branch: any) => {
      this.user.user.branch.push(branch['_id']);
    });
    // console.log('DragDrop after Avaiable: ', this.avaiable_branches);
    console.log('User dRag', this.user);
    this.userBranchUpdate = true;
  }

  resetPassword(id) {
    console.log('Reset password', id);
    swal.fire({
      icon: 'warning',
      title: 'Reset password',
      html: '<p class="text-orange">Esta seguro que desea resetear la contraseña de este usuario?</p> ',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Resetear!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this._user.resetPassword(id).subscribe( (resp: any) => {
          swal.fire({
            title: 'Password reseteado!!',
            html: 'La contraseña del usuario fue reseteada. <br>' +
                  'contraseña actual <b><b class="text-green">1234</b></b>',
            icon: 'success'
          });
        }, err => {
          console.log(err);
          swal.fire({
            title: 'Error al resetear',
            html: 'No se pudo resetear contraseña <br>' +
                  'Error: <br>' +
                  `<p class="text-red">${ err.error.message.message }</p>`,
            icon: 'error'
          });
        });
      }
    });
  }

  ngOnDestroy(): void {

    this.routeSubscription.unsubscribe();
  }
  // updUserBranches(id) {
  //   this._user.updUser(id, this.user.user).subscribe( (resp: any) => {
  //     console.log('usuario updatirigeado: ', resp);
  //   });
  // }
}
