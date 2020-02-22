import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/shared/sidebar.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModel } from 'src/app/models/user.model';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
  providers: [ SidebarService, AuthService ]
})
export class SidebarComponent implements OnInit {
  public menu: any;
  public localUser: any;
  public subscription: Subscription;
  public otraCosa;
  constructor(
    private _sidebar: SidebarService,
    private _auth: AuthService
  ) {  }
  ngOnInit() {
    this.localUser = JSON.parse(localStorage.getItem('user'));
    this._auth.getData().subscribe(resp => {
      this.localUser = resp;
      // subscripción para detectar cambios realizados en la base de datos de la CIA y FBI o.O
    });
  }


}
