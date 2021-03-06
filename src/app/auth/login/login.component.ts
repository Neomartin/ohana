import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModel } from 'src/app/models/user.model';
import swal from 'sweetalert2';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css'],
  providers: [ AuthService ]
})
export class LoginComponent implements OnInit {
  user: UserModel;
  public savedUser;
  public rememberCheck: boolean;
  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {
    this.user = new UserModel(null, null, null, null, 'neomartinr@gmail.com');
  }

  ngOnInit() {
    this.savedUser = JSON.parse(localStorage.getItem('user'));
    this.savedUser ? this.rememberCheck = this.savedUser.remember : this.rememberCheck = false;
    if (this.savedUser) {
      // console.log('Diferencia: ', (Date.now() - this.savedUser.timeout) / (1000 * 60 * 60));
      if (((Date.now() - this.savedUser.timeout) / (1000 * 60 * 60)) > 2) {
        // console.log('entra al date Diff');
        localStorage.removeItem('user');
      } else if (this.savedUser.remember) {
        // console.log('entra al saveduser remember set');
        this.user.username = this.savedUser.username;
        // this.user.password = this.savedUser.password;

      }
    }
  }
  login() {
    const saveUser = {
      username: this.user.username,
      // password: this.user.password,
      timeout: null,
      remember: this.rememberCheck,
      user: undefined
    };
    // console.log('saveuser: ', saveUser);
    this._auth.login(this.user.username, this.user.password, this.rememberCheck).subscribe((resp: any) => {
      console.log('Respuesta del Login: ', resp);
      saveUser.user = resp.user;
      saveUser.timeout = Date.now();
      // if(!this.savedUser.remember)
      localStorage.setItem('user', JSON.stringify(saveUser));
      localStorage.setItem('current_branch', JSON.stringify(resp.user.branch[0]));
      this._auth.setUserData(saveUser);
      swal.fire({
        icon: 'success',
        title: 'Login correcto',
        html: 'Redireccionando al <b class="semi-bold">Panel de Tareas</b>',
        timer: 750,
        // timerProgressBar: true,
      }).then((result) => {
        window.location.href = '/home';
      });
    }, err => {
      swal.fire({
         icon: 'error',
         title: 'Error al ingresar',
         html: `<p> ${err.error.message} </p>`,
      });
    });
  }
  logout() {
    this._auth.logout();
  }
  remember() {
    this.rememberCheck = !this.rememberCheck;
    console.log('rememberCheckSTatus', this.rememberCheck);
  }
}
