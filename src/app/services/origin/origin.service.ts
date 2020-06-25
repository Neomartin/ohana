import { Injectable } from '@angular/core';
// import { AngularFirestore, AngularFirestoreDocument, DocumentReference, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL } from '../../config/config';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OriginService {
  // private originCollection: AngularFirestoreCollection<any>;
  origins: Observable<any[]>;
  // private careerCollection: AngularFirestoreCollection<any>;
  careers: Observable<any[]>;
  public queryObservable: any;
  careers$ = new Subject<any>();
  headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  private URL = URL;
  constructor(
    // private afs: AngularFirestore,
    private http: HttpClient
  ) {
    // this.originCollection = this.afs.collection<any>('origins');
    // this.origins = this.originCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as any;
    //     const id = a.payload.doc.id;
    //     return { id, ...data };
    //   })
    //   )
    // );
    // this.careerCollection = this.afs.collection<any>('careers');
    // this.careers = this.careerCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(a => {
    //     const data = a.payload.doc.data() as any;
    //     const id = a.payload.doc.id;
    //     console.log('Data: ', data);
    //     return { id, ...data };
    //   })
    //   )
    // );
  }
  newOrigin (origin: any) {
    return this.http.post(this.URL + '/from', origin, { headers: this.headers } );
    // console.log('newOriginObject received: ', origin);
    // return this.originCollection.add(origin);
  }
  newCareer (career: any) {
    console.log(career);
    return this.http.post(this.URL + '/from/career', career, { headers: this.headers });
    // console.log('newOriginObject received: ', career);
    // return this.careerCollection.add(career);
  }

  

  findCareers(from_id) {
    return this.http.get(this.URL + '/from/careers/' + from_id, { headers: this.headers });
    // return this.afs.collection('careers', ref => ref.where('origins_id', '==', id)).snapshotChanges();
  }
  getFrom() {
    return this.http.get(URL + '/from', { headers: this.headers });
  }
}
