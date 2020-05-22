import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog } from '@angular/material/dialog';
import swal from 'sweetalert2';


import { UserService } from 'src/app/services/user/user.service';
import { ProfileStatisticsComponent } from 'src/app/components/profile-statistics/profile-statistics.component';
import { DialogPasswordComponent } from 'src/app/components/dialog-password/dialog-password.component';
import { UserModel } from 'src/app/models/user.model';
import { Branch } from 'src/app/models/branch.model';
import { BranchService } from 'src/app/services/branch/branch.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ UserService, BranchService ]
})
export class ProfileComponent implements OnInit {
  public localUser;
  public user;
  public userId;
  public id: String = null;
  branches: Array<Branch>;
  userBranchUpdate: Boolean = false;
  linked_branches = [];
  avaiable_branches = [];
  @ViewChild(ProfileStatisticsComponent, { static: false }) charts;
  constructor(
    private _user: UserService,
    private _branch: BranchService,
    public _dialog: MatDialog,
    public _route: ActivatedRoute
  ) { }
  

  ngOnInit() {
    this.localUser = JSON.parse(localStorage.getItem('user'));
    this.id = this._route.snapshot.paramMap.get('id');
    if (this.id) {
      this._user.getUsers(this.id).subscribe( (resp: any) => {
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
    } else {
      this.user = this.localUser;
    }
  }

  onTabChange(e) {
    // this.charts.saludar();
    if (document.getElementById('sta') ) {
      this.charts.changeView([document.getElementById('sta').offsetWidth]);
    }
  }
  updateUser(id) {
    this._user.updUser(id, this.user.user).subscribe( (resp: any) => {
      this.user.user = resp.updated;
      if (id === this.localUser.user._id) {
        this.localUser.user = resp.updated;
        localStorage.setItem('user', JSON.stringify(this.localUser));
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
      data: { id: this.localUser.user._id, otrodato: 'Hola' }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    // });
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log('Evento de drag and drop');
    // console.log(event.container.data);
    // console.log(event);
    
    // console.log(event);

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
  // updUserBranches(id) {
  //   this._user.updUser(id, this.user.user).subscribe( (resp: any) => {
  //     console.log('usuario updatirigeado: ', resp);
  //   });
  // }
}
