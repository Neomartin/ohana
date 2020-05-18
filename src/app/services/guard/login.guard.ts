import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _auth: AuthService
  ) {}
  canActivate() {
    // console.log('Paso por el Login Guard', this._auth.logged);
    // this._router.navigate(['/login']);
    if (this._auth.logged) {
      console.log('GUARD APPROVED');
      return true;
    } else {
      console.log('No paso el Guard');
      this._router.navigate(['/login']);
      return false;
    }
  }
}
