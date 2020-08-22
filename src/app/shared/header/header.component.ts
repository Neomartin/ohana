import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  public localUser: any;
  public subscraib: Subscription;
  constructor(
    public _auth: AuthService,
    private _user: UserService
  ) {
    // console.log('thisLocal Header USer', this.localUser);
   }

  ngOnInit() {
    this._user.user$.subscribe((resp: any) => {
      // console.log('Header', resp);
      this.localUser = resp;
      // console.log('localUSer', this.localUser);
    });
  }


}
