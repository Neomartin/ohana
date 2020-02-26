import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  public localUser: any;
  constructor(
    private _auth: AuthService
  ) {
    this.localUser = JSON.parse(localStorage.getItem('user'));
   }

  ngOnInit() {
  }

}
