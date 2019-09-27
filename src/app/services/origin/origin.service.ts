import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OriginService {
  private originCollection: AngularFirestoreCollection<any>;
  origins: Observable<any[]>;
  private careerCollection: AngularFirestoreCollection<any>;
  careers: Observable<any[]>;
  public queryObservable: any;
  careers$ = new Subject<any>();
  
  constructor(
    private afs: AngularFirestore
  ) {
    this.originCollection = this.afs.collection<any>('origins');
    this.origins = this.originCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
      )
    );
    this.careerCollection = this.afs.collection<any>('careers');
    this.careers = this.careerCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        console.log('Data: ', data);
        return { id, ...data };
      })
      )
    );
  }
  newOrigin (origin: any) {
    console.log('newOriginObject received: ', origin);
    return this.originCollection.add(origin);
  }
  newCareer (career: any) {
    console.log('newOriginObject received: ', career);
    return this.careerCollection.add(career);
  }
  findCareers(id) {
    return this.afs.collection('careers', ref => ref.where('origins_id', '==', id)).snapshotChanges();
  }
}
