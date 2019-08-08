import { Component, OnInit } from '@angular/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { UserModel } from 'src/app/models/user.model';
import swal from 'sweetalert2';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: [ 'add-file.component.css'],
  providers: [ UserService,
               {provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
               {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
               {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
             ]
})
export class AddFileComponent implements OnInit {
  public selectedDate: Date;
  public newUser: any;
  public user: UserModel;
  isLoading = false;
  searchMoviesCtrl = new FormControl();
  filteredMovies: any;
  errorMsg: string;
  options = [];
  constructor(
    private _user: UserService,
  ) {
    this.user = new UserModel('', '', '', '', '', '', '', '', '', '');
  }
  ngOnInit() {

    this._user.users.subscribe(resp => {
      console.log(resp);
      resp.forEach(element => {
        for (const key in element) {
          if (element.hasOwnProperty(key) && key === 'name') {
            const name = element[key];
            this.options.push(name);
          }
        }
      });
      this.filteredMovies = this.options;
      console.log('Creacion filtered: ', this.filteredMovies);
      // this.options.push(...resp);
    });
    this.searchMoviesCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap((ev) => {
          this.errorMsg = '';
          this.filteredMovies = [];
          // console.log('Filtered: ', this.filteredMovies);
          // this.isLoading = true;
          console.log(ev);
        }),
        switchMap((value) => this._filter(value))
        )
      .subscribe(data => {
        // console.log('Entra aca');
        // console.log('DATA: ', data);
        if (data === undefined) {
          this.errorMsg = data['Error'];
          this.filteredMovies = this.options;
        } else {
          this.errorMsg = '';
          this.filteredMovies.push(data);
        }
        console.log(this.filteredMovies);
      });
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addUser () {
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Nombre',
        text: 'Ingrese nombre del usuario'
      },
      {
        title: 'Apellido',
        text: 'Ingrese Apellido del usuario'
      },
      {
        title: 'Teléfono',
        text: 'Ingrese celular o fijo del usuario'
      }
    ]).then( (result) => {
      // const usuarito = result.value[0].trim().split(" ");
      // console.log(usuarito.length - 1);
      // this.user.name = usuarito.slice(0, usuarito.length - 1).join(" ");
      this.user.name = result.value[0];
      // console.log(usuarito[usuarito.length - 1]);
      // this.user.surname = usuarito[usuarito.length - 1];
      this.user.surname = result.value[1];
      this.user.phone = result.value[2];
      console.log(this.user);
      // console.log(usuarito);
      // console.log(this.newUser.name.string_to_array());
      this._user.newClient(this.user)
        .then( resp => {
          console.log('Retornar', resp);
        })
        .catch(err => {
          console.log('Error: ', err);
      });
      swal.fire({
        title: 'Carga finalizada',
        html:
          'Your answers: <pre><code>' +
            JSON.stringify(result.value) +
          '</code></pre>'
      });
    })
  }

  displayFn(user: any, index) {
    console.log('event ', user);
    console.log('index ', index);
    
    if (!user) {
      return '';
    }
    console.log('DisplatFN: ',  user);
    // this.clientId(user);
    return user;
  }
  clientId(e) {
    this.user.id = e;
  }

}
