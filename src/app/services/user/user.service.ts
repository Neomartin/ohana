import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { URL } from '../../config/config';
import { UserModel } from 'src/app/models/user.model';
import { map, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly path: 'users';
  public URL = URL;
  public headers = new HttpHeaders()
                          .set('Content-Type', 'application/json; charset=utf-8')
                          .set('Authorization', localStorage.getItem('token'));
  users: Observable<UserModel[]>;
  user = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
  user$ = this.user.asObservable();
  constructor(
    private _http: HttpClient
    // private afsDoc: AngularFirestoreDocument
  ) {
    // this.user.next(JSON.parse(localStorage.getItem('user')));
  }

  newClient(user: UserModel) {
    console.log('User service: ', user);
    if (!user.password) { user.password = '1234'; }
    return this._http.post(URL + '/user', user, { headers: this.headers});
    // console.log('MODELO: ', user);
    // return this.usersCollection.add({...user});
  }
  getUsers(id = null) {
    if (id) {
      return this._http.get(URL + '/user/' + id, { headers: this.headers });
    } else {
      return this._http.get(URL + '/user', { headers: this.headers });
    }
  }
  updUser(id: string, user: any) {
    const localUser = JSON.parse(localStorage.getItem('user'));
    return this._http.put(URL + '/user/' + id, user, { headers: this.headers })
      .pipe(
        tap((resp: any) => {
          if (localUser.user._id === id) {
            // const userNext = JSON.parse(localStorage.getItem('user'));
            // Rearmo el objeto para luego guardarlo en el LocalStorage
            localUser.user = resp.updated;
            this.user.next(localUser);
            localStorage.setItem('user', JSON.stringify(localUser));
          }
      })
      );
 
  }
  delUser(id: string) {
    return this._http.delete(URL + '/user/' + id, { headers: this.headers });
  }
  updPassword(id: string, oldPassword: string, newPassword: string) {
    // tslint:disable-next-line:max-line-length
    return this._http.put(URL + '/user/password/' + id, { 'oldPassword': oldPassword, 'newPassword': newPassword }, { headers: this.headers });
  }
  resetPassword(id: string) {
    return this._http.get( URL + '/user/reset-password/' + id, { headers: this.headers });
  }
  // updateData(data) {
  //   console.log('Update data', data);
  //   this.user.next(data);
  // }
}
