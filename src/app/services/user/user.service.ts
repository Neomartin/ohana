import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { URL } from '../../config/config';
import { UserModel } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly path: 'users';
  private usersCollection: AngularFirestoreCollection<UserModel>;
  public URL = URL;
  public headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  users: Observable<UserModel[]>;
  constructor(
    private afs: AngularFirestore,
    private _http: HttpClient
    // private afsDoc: AngularFirestoreDocument
  ) { }
  newClient(user: UserModel) {
    console.log('User service: ', user);
    return this._http.post(URL + '/user', user, { headers: this.headers });
    // console.log('MODELO: ', user);
    // return this.usersCollection.add({...user});
  }
  getUsers() {
    return this._http.get(URL + '/user', { headers: this.headers });
  }
  updUser(id: string, user: UserModel) {
    return this._http.put(URL + '/user/' + id, user, { headers: this.headers });
  }
  delUser(id: string) {
    return this._http.delete(URL + '/user/' + id, { headers: this.headers });
  }
}
