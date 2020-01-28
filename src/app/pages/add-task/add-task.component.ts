import { Component, OnInit, ViewChild } from '@angular/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { FormControl, Validators } from '@angular/forms';
import { startWith, debounceTime, tap, switchMap } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

// Services
import { OrderService } from 'src/app/services/order/order.service';

// Plugins
import swal from 'sweetalert2';
import * as _moment from 'moment';

// Components
import { FilesComponent } from '../files/files.component';
// Models
import { UserModel } from '../../models/user.model';
import { Order } from '../../models/order.model';
import { File } from '../../models/file.model';
import { TaskFileList } from '../../models/file-list.model';
import { ActivatedRoute } from '@angular/router';
import { OrderPrintComponent } from 'src/app/components/order-print/order-print.component';
// import moment = require('moment');

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['add-task.component.css'],
  providers: [OrderService, { provide: MAT_DATE_LOCALE, useValue: 'es-ES',  },
  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},]
})
export class AddTaskComponent implements OnInit {
  // public selectedDate: Date;
  public orderID: string;
  public searchFromClient = new FormControl();
  public user = new UserModel(null, null, null, null);
  public clients: any[] = [];
  public filteredClient: any;
  public fileList = [];
  public total = 0;
  public order: Order;
  public partialPayment = null;
  public orderButton: Boolean = false;
  public updateButton: Boolean = false;
  public reloadFiles: Subject<boolean> = new Subject();
  public searchFilter: BehaviorSubject<string> = new BehaviorSubject('');
  // Date
  public date = new FormControl(new Date(), [ Validators.required ]);
  public selectedDate;
  public endDate = _moment().unix();
  public minDate = new Date();
  @ViewChild(FilesComponent, { static: true }) filesComponent;
  @ViewChild(OrderPrintComponent, { static: true}) _orderPrintComponent;
  selectedClient: UserModel = new UserModel(null, null, null, null);
  constructor(
    private _user: UserService,
    private _order: OrderService,
    private _snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.params.subscribe(p =>  this.orderID = p['id']);
  }

  ngOnInit() {
    // Si se recibe un ID de una ordern por parametro de URL para EDITAR
    if (this.orderID) {
      this._order.getOrder(this.orderID).subscribe( (resp: any) => {
        console.log('Respuesta de Orden con ID: ', resp);
        this.total = resp.order.price;
        this.partialPayment = resp.order.partial_payment;
        this.selectedClient = resp.order.client_id;
        this.fileList = resp.order.items;
        this.setClientID = resp.order.client_id._id;
        // console.log('selected', this.selectedClient);
        this.searchFromClient.setValue(this.selectedClient);
        this.updateButton = true;
        // console.log(this.fileList.length);
        this.fileList = this.fileList.map((o: any) => {
          console.log('O_', o);
          return {
            name: o.file_id.name,
            quantity: o.quantity,
            price: o.price,
            _id: o.file_id._id,
          };
        });
      });
    }

    // Set de opciones a enviar al FileComponente y acceder a sus funciones
    this.filesComponent.fileListOptions = {
      add: true,
      delete: false
    };
    this.getUsers();

    this.searchFromClient.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap(() => {
          // console.log('Entra1');
          this.filteredClient = [];
        }),
        switchMap((value) => this._filterClient(value))
      ).subscribe(data => {
        // console.log('data: ', data);
        if (data === undefined) {
          this.filteredClient = this.clients;
          // thilis.from_id = null
        } else {
          this.filteredClient.push(data);
        }
      });
  } // ****** ngOnInit ************/
  getUsers() {
    this._user.getUsers().subscribe( (resp: any) => {
      console.log(resp);
      this.clients = resp.usuarios;
      this.filteredClient = resp.usuarios;
    });
  }
  addFileToTask(file) {
    if (this.fileList.find((o: any) => o._id === file._id)) {
      return this._snackBar.open('El archivo ya se encuentra en la Orden', 'Error', {
        duration: 2000,
      });
    }
    this.orderButton = false;
    // console.log(this.orderButton);
    // console.log('Parent: ', file);
    file.quantity = 1;
    file.price = null;
    // file.created_at = undefined;
    // file.from_id = undefined;
    this.fileList.push(file);
    // console.log('FILELIST ORIGINAL: ', this.fileList);
  }

  removeFileFromTask(index) {
    console.log('Index', index);
    this.fileList.splice(index, 1);
    this.calculateTotal();
    if (this.total < this.partialPayment) { this.partialPayment = this.total; }
  }

  calculateTotal() {
    console.log(this.fileList);
    if (this.fileList) {
      this.total =  this.fileList.reduce( (val, file) => {
        console.log('Entra al reduce');
        file.price ? this.orderButton = true : this.orderButton = false;
        val = val + (file.price * file.quantity);
        return val;
      }, 0);
    }
  }

  newOrder(update: boolean = false) {
    // console.log('Update', update);
    if (this.selectedClient && (this.selectedClient.id || this.selectedClient._id) && this.fileList.length > 0 ) {
      // console.log('EndDate: ', this.endDate);
      // console.log('Now MOMENT: ', _moment().unix());
      this.order = {
        client_id: this.selectedClient.id ? this.selectedClient.id : this.selectedClient._id,
        // mapeo de fileList
        items: this.fileList.map( (o: any) => {
          console.log('Objeto en newOrder', o);
          return {
            name: o.name,
            quantity: o.quantity,
            price: o.price,
            file_id: o._id,
          };
        }),
        status: 'processed',
        created_at: _moment().unix(),
        modified_at: null,
        partial_payment: (this.partialPayment) ? this.partialPayment : this.partialPayment = 0,
        price: this.total,
        end_at: this.endDate + (23.99 * 3600),
      };
      // this.orderButton = true;
      // console.log('Orden ----------');
      // console.log(this.order);
      if (update) {
        console.log('Entra al update');
        this._order.updateOrder(this.order, this.orderID).subscribe( (resp: any) => {
          console.log('UPDATE ORDER: ', resp);
          swal.fire({
            type: 'info',
            title: 'Orden Actualizada!',
            text: 'Se ACTUALIZÓ orden se imprimirá orden',
            position: 'bottom-end',
            timer: 1500,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: '#f00',
            cancelButtonText: 'No imprimir',
          }).then( (result) => {
            if (result.dismiss !== swal.DismissReason.cancel) {
              this._orderPrintComponent.print(resp.updated);
            }
          });
        });
      } else {
        this._order.newOrder(this.order).subscribe( (resp: any) => {
          console.log('Respuesta al agregar orden: ', resp);
          swal.fire({
            type: 'success',
            title: 'Orden Creada!',
            text: 'Se ORIGINÓ orden y se imprimirá',
            position: 'bottom-end',
            timer: 1500,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: '#f00',
            cancelButtonText: 'No imprimir',
          }).then( (result) => {
            if (result.dismiss !== swal.DismissReason.cancel) {
              this._orderPrintComponent.print(resp.saved);
            }
          });
        }, err => {
          console.log('Error', err);
        });
      }
    }
  }

  changeDate(time) {
    // console.log('Time',  _moment(time).unix());
    // console.log('TimeEND',  this.endDate);
    // console.log('DateNow',  Date.now());
    this.endDate = _moment(time).unix();
  }
  async inputTry() {
    const { value: newPerson } = await swal.fire({
      type: 'info',
      title: 'Nuevo cliente',
      html: 'Ingrese los datos del cliente <br>' +
            '<input type="text class="form-control" name="name" id="name" placeholder="Nombre" class="swal2-input">' +
            '<input type="text name="surname" id="surname" placeholder="Apellido" class="swal2-input">' +
            '<input type="text name="phone" id="phone" value="260-4" placeholder="Teléfono" class="swal2-input"></form>' +
            '<input type="email name="email" id="email" placeholder="Email *opcional" class="swal2-input"></form>',
      showCancelButton: true,
      confirmButtonColor: '#57af04',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar',
      footer: '<h3 href>Creador de usuarios</h3>',
      focusConfirm: true,
      preConfirm: () => {
        return [
          (document.getElementById('name') as HTMLInputElement).value,
          (document.getElementById('surname') as HTMLInputElement).value,
          (document.getElementById('phone') as HTMLInputElement).value,
          (document.getElementById('email') as HTMLInputElement).value,
        ];
      },
      onOpen: () => {
        document.getElementById('name').focus();
      },
    });
    console.log('NewPerson: ', newPerson);
    if (newPerson && newPerson[0] && newPerson[1] && newPerson[2]) {
      this.user.role = 'CLIENT_ROLE';
      this.user.name = newPerson[0];
      this.user.surname = newPerson[1];
      this.user.phone = newPerson[2];
      if (newPerson[3]) { this.user.email = newPerson[3]; }

      this._user.newClient(this.user).subscribe( (resp: any) => {
        console.log(resp);
        this.getUsers();
        swal.fire({
          type: 'success',
          title: 'Cliente creado',
          html: 'Agregado correctamente!<br>' + this.user.name  + ' ' + this.user.surname
        } );
        this.user = new UserModel(null, null, null, null, null);
      }, err => {
        swal.fire({
          type: 'error',
          title: 'Error al crear cliente',
          html: err.error.message + '<br>' + err.error.errors.message
        } );
      });
      
    }
  }

  filterFile(value: string) {
    this.searchFilter.next(value);
  }

  displayFnClient(client) {
    if (!client) { return ''; }
    this.selectedClient = undefined;
    return client.name + ' ' + client.surname;
  }

  private _filterClient(value): string[] {
    let filtrado = this.clients.filter( (s) => new RegExp(value, 'gi').test(s.name));
    console.log('filtrado: ', filtrado);
    if (filtrado.length > 0) {
      console.log('filtrado true');
      return filtrado;
    } else {
      console.log('filtrado false');
      filtrado = this.clients.filter( (s) => new RegExp(value, 'gi').test(s.surname));
      console.log('filtrado: ', filtrado);
      return filtrado;
    }
}
setClientID(client: any) {
  console.log(client);
  this.selectedClient.id = client._id;
}

checkPartialPayment() {
  if (this.partialPayment > this.total) {
    this.partialPayment = this.total;
  }
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

  resetForm() {
    this.date.setValue(_moment());
    this.filterFile('');
    this.searchFromClient.setValue('');
    this._filterClient('');
    this.fileList = [];
    this.total = 0;
    this.partialPayment = null;
  }
}
