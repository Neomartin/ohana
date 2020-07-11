import { Injectable } from '@angular/core';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { URL} from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';

// interface User {
//     uid: string;
//     email: string;
//     displayName: string;
//     photoURL: string;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private user: UserModel;
    private URL: URL;
    public logged;
    public userLogged;
    public userData = new Subject<any>();
    // public data = this.userData.asObservable();
    public loguedIn = false;
    private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')

    constructor(
        private _http: HttpClient,
        private _router: Router
    ) {
        this.logged = localStorage.getItem('token');
    }
    login(user: string, password: string, remember: boolean) {
        return this._http.post(URL + '/login', { user, password }, { headers: this.headers })
            .pipe(
                map((resp: any) => {
                    localStorage.setItem('token', resp.token);
                    console.log('Respuesta service', resp.user);
                    this.logged = true;
                    return resp;
                })
            );
    }

    logout() {
        localStorage.removeItem('token');
        this._router.navigate(['/login']);
    }
    getData(): Observable<any> {
        // console.log('llamado al GetDFAf', this.userData);
        return this.userData.asObservable();
    }
    setUserData(userToSave) {
       console.log('llamado al userToSave', userToSave);
       this.userData.next(userToSave);
    }
        // return console.log();
}
