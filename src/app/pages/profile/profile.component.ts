import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import swal from 'sweetalert2';


import { UserService } from 'src/app/services/user/user.service';
import { ProfileStatisticsComponent } from 'src/app/components/profile-statistics/profile-statistics.component';
import { DialogPasswordComponent } from 'src/app/components/dialog-password/dialog-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public localUser;
  public userId;
  linked_branchs = [
    { name: 'Ohana SR', location: 'San Rafael', adress: 'Corrientes', adress_number: '432'},
    { name: 'Ohana SR', location: 'San Rafael', adress: 'Ejercito de los Andres', adress_number: '1085'},
    { name: 'Ohana MG', location: 'Malargüe', adress: 'Godoy Cruz', adress_number: '211'}
  ];

  avaiable_branchs = [
    { name: 'Ohana SR', location: 'San Rafael', adress: 'Av. Moreno', adress_number: '780'},
    { name: 'Ohana GA', location: 'General Alvear', adress: 'Libertad', adress_number: '360'},
    { name: 'Ohana MG', location: 'Malargüe', adress: 'Godoy Cruz', adress_number: '814'},
    { name: 'Ohana SR', location: 'San Rafael', adress: 'Chile', adress_number: '954'},
  ];
  constructor(
    private _user: UserService,
    public _dialog: MatDialog
  ) { }
  @ViewChild(ProfileStatisticsComponent, { static: true }) charts;

  ngOnInit() {
    this.localUser = JSON.parse(localStorage.getItem('user'));
    console.log(this.localUser);
  }

  onTabChange(e) {
    if (document.getElementById('sta')) {
      this.charts.changeView([document.getElementById('sta').offsetWidth]);
    }
  }
  updateUser() {
    console.log('llamado update', this.localUser.user);
    this._user.updUser(this.localUser.user._id, this.localUser.user).subscribe( (resp:any) => {
      console.log('Respuesta desde el update: ', resp);
      this.localUser.user = resp.updated;
      localStorage.setItem('user', JSON.stringify(this.localUser));
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
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex);
    }
  }
}
