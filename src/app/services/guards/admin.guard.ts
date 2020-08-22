import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Router, RoutesRecognized, ChildActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  public access_level = 0;
  constructor(
    private _user: UserService,
    private _router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    this._user.user$.subscribe(
       (resp: any) => {
          this.access_level = resp.user.role.access_level;
    });

   if (!next.data.tier ) { return true; }
   if (this.access_level >= next.data.tier) {
    return true;
   } else {
     this._router.navigateByUrl('/');
     return false;
   }
  }
}
