import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/shared/sidebar.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
  providers: [ SidebarService, AuthService ]
})
export class SidebarComponent implements OnInit {
  public menu: any;
  constructor(
    private _sidebar: SidebarService,
    private auth: AuthService
  ) {  }
  ngOnInit() {
  }

  

}
