//app.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest, Subject  } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
 
export interface Item {
  text: string;
  color: string;
  size: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.sass']
})
export class AutocompleteComponent implements OnInit {
  usersCollection: AngularFirestoreCollection<any>;
  items$ = new Subject<any>();
  sizeFilter$: BehaviorSubject<string|null>;
  colorFilter$: BehaviorSubject<string|null>;
  itemz: any;
  newQuery = new Observable<any>();
  constructor(private afs: AngularFirestore) {
    this.itemz = this.items$.next();
    this.usersCollection = this.afs.collection<any>('users');
    this.sizeFilter$ = new BehaviorSubject(null);
    this.colorFilter$ = new BehaviorSubject(null);
    // this.items$ = this.afs.collection<any>('users').valueChanges().pipe(
    //   map( actions => actions.map(a => {
    //   return a.payload.doc.data();
    // })));
    this.newQuery = this.items$.pipe(
      switchMap((id) =>
          this.afs.collection<any>('users', ref => {
            let query: firebase.firestore.Query = ref;
            if (id) { query = query.where('name', '==', id); }
            return query;
        }).valueChanges()
    ));
    // console.log('1:', this.newQuery);
    
    // .switchMap(([size, color]) => 
    //   afs.collection<Item>('items', ref => {
      //     let query : firebase.firestore.Query = ref;
      //     if (size) { query = query.where('size', '==', size) };
      //     if (color) { query = query.where('color', '==', color) };
      //     return query;
      //   }).valueChanges()
      // );
      
      // console.log('3:', this.newQuery);
    }
    
    ngOnInit() {
      this.newQuery.subscribe((queriedItems: any) => {
        console.log('Queried items', queriedItems);
        this.itemz = queriedItems;
      });
      this.findId();
      console.log('2:', this.newQuery);
    }
    
  findId(id: string = null) {
    setTimeout( _ => {
      this.items$.next(id);

    }, 300)
    // console.log('ID: ', id);
    // console.log('1:', this.newQuery);
  }

  filterBySize(size: string|null) {
    this.sizeFilter$.next(size); 
  }
  filterByColor(color: string|null) {
    this.colorFilter$.next(color); 
  }
}