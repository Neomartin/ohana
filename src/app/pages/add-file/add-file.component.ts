import { Component, OnInit } from '@angular/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { UserModel } from 'src/app/models/user.model';
import swal from 'sweetalert2';
import { UserService } from 'src/app/services/user/user.service';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OriginService } from 'src/app/services/origin/origin.service';
import { log } from 'util';




@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: [ 'add-file.component.css'],
  providers: [  UserService,
                OriginService,
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
  public from_id = '';
  public career_id = '';
  public years = ['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Sexto'];
  isLoading = false;
  filteredClients: any;
  filteredFrom: any;
  filteredCareer: any;
  searchClientCtrl = new FormControl();
  searchFromCtrl = new FormControl();
  searchCareerCtrl = new FormControl();
  yearCtrl = new FormControl('', [Validators.required]);
  career = [];
  from = [];
  // career = [];
  options = [];
  // froms = ['One', 'Two', 'Three'];
  errorMsg: string;
  year: string;
  constructor(
    private _user: UserService,
    private _origin: OriginService
  ) {

  }
  ngOnInit() {
    //cargar carreras;
    this.loadCareers();
    this._origin.origins.subscribe(resp => {
      console.log('ORIGINS: ', resp);
      this.from = resp;
      this.filteredFrom = this.from;
    });
    this._user.users.subscribe(resp => {
      console.log(resp);
      this.options = resp;
      this.filteredClients = this.options;
      // resp.forEach(element => {
      //   const obj = {
      //     name: '',
      //     id: '',
      //   };
      //   for (const key in element) {
      //     if (element.hasOwnProperty(key)) {
      //       if (key === 'name') {
      //         obj.name = element[key];
      //       }
      //       if (key === 'id') {
      //         obj.id = element[key];
      //       }
      //     }
      //   }
      //   this.options.push(obj);
      // });
      // // console.log('Options: ', this.options);
    });
    this.searchFromCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap(() => {
          this.filteredFrom = [];
        }),
        switchMap((value) => this._filterFrom(value))
      ).subscribe(data => {
        if (data === undefined) {
          this.filteredFrom = this.from;
        } else {
          this.filteredFrom.push(data);
        }
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
      ).subscribe(data => {
        if (data === undefined) {
          this.errorMsg = 'Error al cargar';
          this.filteredClients = this.options;
        } else {
          this.errorMsg = '';
          this.filteredClients.push(data);
        }
      });
      this.searchCareerCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap(() => {
          this.filteredCareer = [];
        }),
        switchMap((value) => this._filterCareer(value))
      ).subscribe(data => {
        if (data === undefined) {
          this.filteredCareer = this.career;
        } else {
          this.filteredCareer.push(data);
        }
      });
  } // ***********NGONINIT********************/

  private _filter(value): string[] {
    // if (value && !value.hasOwnProperty('name')) {
    //   const filterValue = value.toLowerCase();
    // }
    return this.options.filter( (s) => new RegExp(value, 'gi').test(s.name));
  }
  private _filterFrom(value): string[] {
    if (!value) {
      this.searchCareerCtrl.reset();
    }
    console.log('ValueFilter: ', value);
    return this.from.filter( (s) => new RegExp(value, 'gi').test(s.name));
  }
  private _filterCareer(value): string[] {
    return this.career.filter( (s) => new RegExp(value, 'gi').test(s.name))
  }
  loadCareers() {
    this._origin.careers.subscribe(resp => {
      console.log('RESPUESTA CARRERAS: ', resp);
      this.career = resp;
      localStorage.setItem('careers', JSON.stringify(resp));
      this.filteredCareer = [];
      // this.filteredCareer = this.career;
    });
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
          // console.log('Retornar', resp);
          // console.log('ACTIONS: ', this._origin.origins);
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
        title: 'LUGAR',
        input: 'select',
        inputOptions: {
          'Universidad': 'Universidad',
          'Instituto': 'Instituto',
          'Colegio': 'Colegio',
          'Escuela': 'Escuela',
          'Otro': 'Otro'
        },
        inputPlaceholder: 'Seleccione tipo',
      },
      {
        title: 'Número',
        text: 'Ingrese número del colegio/institución'
      },
      {
        title: 'Nombre',
        text: 'Nombre de la institución'
      }
    ]).then( (result) => {
      // const usuarito = result.value[0].trim().split(" ");
      // console.log(usuarito.length - 1);
      // this.user.name = usuarito.slice(0, usuarito.length - 1).join(" ");
      const newFrom: any = {};
      newFrom.type = result.value[0];

      // console.log(usuarito[usuarito.length - 1]);
      // this.user.surname = usuarito[usuarito.length - 1];
      if (result.value[1]) {
        newFrom.name = result.value[0] + ' ' + result.value[1] + ' ' + result.value[2];
        newFrom.number = result.value[1];
      } else {
        newFrom.name = result.value[0] + ' '  + result.value[2];
      }
      // newFrom.name = result.value[0] + ' ' + result.value[1] + ' ' + result.value[2];
      // console.log(newFrom);
      // console.log(this.newUser.name.string_to_array());
      this._origin.newOrigin(newFrom)
        .then(resp => {
          console.log('Respuesta recibida: ', resp);
        })
        .catch(err => {
          console.log('Error en la respuesta: ', err);
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
  addCareer (value) {
    const career: any = {};
    this.from.forEach(element => {
      // console.log('Elementos: ', element);
      let name: string;
      let id: string;
      for (const key of Object.keys(element)) {
        if (element.hasOwnProperty(key) && key === 'name') {
            name = element[key];
            // console.log('Name ', name);
        }
        if (element.hasOwnProperty(key) && key === 'id') {
          id = element[key];
          // console.log('ID ', id);
        }
      }
      career[id] = name;
    });
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Siguiente &rarr;',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      progressSteps: ['1', '2'] 
    }).queue([
      {
        title: 'Origen',
        input: 'select',
        inputOptions: career,
        inputPlaceholder: 'Seleccione tipo',
      },
      {
        title: 'Carrera',
        text: 'Ingrese nombre completo de la carrrera'
      },
    ]).then( (result) => {
      const newCareer: any = {};
      newCareer.origin_id = result.value[0];
      newCareer.name = result.value[1];
      // newCareer.year = this.year;
      this._origin.newCareer(newCareer)
        .then(resp => {
          console.log('Respuesta recibida: ', resp);
        })
        .catch(err => {
          console.log('Error en la respuesta: ', err);
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
  findCareers(e) {
    this.career = JSON.parse(localStorage.getItem('careers'));
    const provi: any = [];
    this.career.forEach(element => {
      for (const key of Object.keys(element)) {
        if(key === 'origin_id') {
          if (e.id === element[key]) {
            provi.push(element);
          }
        }
      }
    });
    this.filteredCareer = provi;
    this.career = provi;
    console.log('Career: ', this.career);
  }
  displayFn(user) {
    if (!user) { return ''; }
    this.client_id = user.id;
    return user.name;
  }

  displayFnFrom(from) {
    if (!from) { return ''; }
    console.log('From displayFn', from);
    this.from_id = from.id;
    return from.name;
  }
  displayFnCareer(career) {
    if (!career) { return ''; }
    console.log('Career displayFn: ', career);
    this.career_id = career.id;
    return career.name;
  }
  yearFn(e) {
    console.log(e);
    
  }
}
