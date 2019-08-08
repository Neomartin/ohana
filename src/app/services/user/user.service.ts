import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly path: 'users';
  private usersCollection: AngularFirestoreCollection<UserModel>;
  users: Observable<UserModel[]>;
  constructor(
    private afs: AngularFirestore,
    // private afsDoc: AngularFirestoreDocument
  ) {
    this.usersCollection = this.afs.collection<UserModel>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(map(
      actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    ));
   }
  newClient(user: UserModel) {
    console.log('MODELO: ', user);
    return this.usersCollection.add({...user});
  }
}
