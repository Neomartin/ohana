import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanLoad {
  private autho: boolean;
  constructor(
    private _router: Router,
    private _auth: AuthService
  ) {}
  canLoad() {
    return this._auth.tokenValidate().pipe(
      tap((auth: any) => {
        console.log('Auth resp', auth);
        if (!auth) {
          this._router.navigateByUrl('/login');
        }
      })
    );
  }
  canActivate() {
    console.log('Paso por el Login Guard');
    // this._router.navigate(['/login']);
    // return true;
    return this._auth.tokenValidate().pipe(
      tap((auth: any) => {
        if (!auth) {
          this._router.navigateByUrl('/login');
        }
      })
    );
}
}
