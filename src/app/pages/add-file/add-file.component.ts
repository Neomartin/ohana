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
  public user: UserModel = new UserModel('', '', '', '', '', '', '', '', '', '');
  public client_id = '';
  isLoading = false;
  searchClientCtrl = new FormControl();
  filteredClients: any;
  searchFromCtrl = new FormControl();
  from = [];
  filteredFrom: any;
  errorMsg: string;
  options = [];
  constructor(
    private _user: UserService,
  ) {

  }
  ngOnInit() {

    this._user.users.subscribe(resp => {
      console.log(resp);
      resp.forEach(element => {
        const obj = {
          name: '',
          id: '',
        };
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            if (key === 'name') {
              obj.name = element[key];
            }
            if (key === 'id') {
              obj.id = element[key];
            }
          }
        }
        this.options.push(obj);
      });
      this.filteredClients = this.options;
    });
    this.searchClientCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap(() => {
          this.errorMsg = '';
          this.filteredClients = [];
          // console.log(ev);
        }),
        switchMap((value) => this._filter(value))
        )
      .subscribe(data => {
        if (data === undefined) {
          this.errorMsg = 'Error al cargar';
          this.filteredClients = this.options;
        } else {
          this.errorMsg = '';
          this.filteredClients.push(data);
        }
        // console.log(this.filteredMovies);
      });
  }

  private _filter(value): string[] {
    // if (value && !value.hasOwnProperty('name')) {
    //   const filterValue = value.toLowerCase();
    // }
    return this.options.filter( (s) => new RegExp(value, 'gi').test(s.name));
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


  addFrom () {
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: true,
      cancelButtonColor: '#d33',
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

  displayFn(user) {
    if (!user) {
      return '';
    }
    // console.log('DisplatFN: ',  user);
    this.client_id = user.id;
    // this.clientId(user.id);
    return user.name;
  }

  displayFnFrom() {
    console.log('displayFnFrom called');
    
  }
}
