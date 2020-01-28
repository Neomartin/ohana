import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

interface User {
    uid: string,
    email: string,
    displayName: string,
    photoURL: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user: User = <User>{};
    public userData: Observable<UserModel>;
    public loguedIn = false;
    // authState: any = null;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
        this.afAuth.authState.subscribe( (user: any) => {
            if (user && user !== null) {
                // console.log(user.uid);
                console.log('Logueado');
                this.user.uid = user.uid;
                this.loguedIn = true;
                console.log(this.loguedIn);
                this.getUserData(user.uid);
                // this.router.navigate(['/home']);
            } else {
                // this.router.navigate(['/login']);
                this.loguedIn = false;
                localStorage.removeItem('user');
                console.log('NO logueado');
                this.user = <User>{};
            }
        });

    }
    login(user: string, password: string) {
        const email = user + '@gmail.com';
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((value: any ) => {
                // console.log(value);
                console.log('Nice, it worked!');
            })
            .catch(err => {
                console.log('Algo anda mal: ', err.message);
            });
    }

    logout() {
        this.afAuth.auth.signOut().then( () => console.log('Logout correcto')).catch( err => {
            // console.log('Error al desloguear');
            this.loguedIn = false;
        });
    }

    getUserData(id: string) {
        this.afs.doc(`users/${this.user.uid}`).get().subscribe((resp: any) => {
            this.userData = resp.data();
            console.log('USER DATA: ', this.userData);
            // Set localStorage
            localStorage.setItem('user', JSON.stringify(this.userData));
            if (localStorage.getItem('user')) {
                // this.router.navigate(['/home']);
            }
        });
    }
        // return console.log();
    

}