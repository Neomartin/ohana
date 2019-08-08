import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModel } from 'src/app/models/user.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [ AuthService ]
})
export class LoginComponent implements OnInit {
  user: UserModel;
  constructor(
    private auth: AuthService
  ) { 
    this.user = new UserModel('', '', 'neomartinr', '33464282', '');
  }

  ngOnInit() {
  }
  
  login() {
    this.auth.login(this.user.username, this.user.password);
  }
  logout() {
    this.auth.logout();
  }
}
