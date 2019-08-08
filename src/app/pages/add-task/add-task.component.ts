import { Component, OnInit } from '@angular/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import swal from 'sweetalert2'; 

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['add-task.component.css'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},]
})
export class AddTaskComponent implements OnInit {
  public selectedDate: Date;
  name: String = '';
  options: string[] = ['One', 'Two', 'Three'];
  constructor() { }

  ngOnInit() {

  }
  inputTry() {
    swal.fire({
      type: 'info',
      title: 'Ingrese los datos del usuario',
      html: '<input type="text [(ngModel)]="name" name="name" placeholder="Nombre" class="swal2-input">' +
            '<input type="text name="surname" placeholder="Apellido" class="swal2-input">' +
            '<input type="text name="phone" placeholder="Teléfono" class="swal2-input">' +
            '<br> {{ name }}',
      showCancelButton: true,
      confirmButtonColor: '#57af04',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar'
    }).then( () => {
      console.log(this.name);
    })
  }
  hola() {
    swal.mixin({
      input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([
    {
      title: 'Nombre',
      text: 'Chaining swal2 modals is easy'
    },
    'Question 2222',
    'Question 3'
  ]).then((result) => {
    if (result.value) {
      swal.fire({
        title: 'All done!',
        html:
          'Your answers: <pre><code>' +
            JSON.stringify(result.value) +
          '</code></pre>',
        confirmButtonText: 'Lovely!'
      })
    }
      })
    }

  agregarArchivo() {
    swal.fire({
      position: 'bottom-end',
      type: 'success',
      title: 'Libro agregado',
      text: 'Se agrego libro al pedido actual correctamente',
      showConfirmButton: false,
      timer: 2500
    });
  }
}
