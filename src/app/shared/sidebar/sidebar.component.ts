import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { Subscription, Observable } from 'rxjs';

import { SidebarService } from '../../services/shared/sidebar.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  public adminLink = false;
  constructor(
    public _sidebar: SidebarService,
    public _auth: AuthService,
    private _user: UserService,
    private _route: ActivatedRoute,
    private _router: Router

    ) { }
  ngOnInit() {
      if (this._router.url === '/branches') {
        this.adminLink = true;
      } else {
        this.adminLink = false;
      }
      this._user.user.subscribe(resp => {
      // console.log('Sidebar Subscription', resp);
      this.localUser = resp;
      // Tener en cuenta las instancias del servicio, si agrego en el componente como provider un servicio
      // Voy a estar creando una instancia independiente del mismo por lo que las subcripcions serán distintas
      // Para esto lo recomendable es colocar como provider el servicio en un módulo que los contenga a ambos
      // subscripción para detectar cambios realizados en la base de datos de la CIA y FBI o.O
    });
  }
  
  logout() {
    this._auth.logout();
  }

}
