import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { UserService } from 'src/app/services/user/user.service';
import { FormControl, Validators } from '@angular/forms';
import { startWith, debounceTime, tap, switchMap, map } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
// Services
import { OrderService } from 'src/app/services/order/order.service';

// Plugins
import swal from 'sweetalert2';
import * as _moment from 'moment';
import * as cloneDeep from 'lodash/cloneDeep';

// Components
import { FilesComponent } from '../files/files.component';
import { OrderPrintComponent } from 'src/app/components/order-print/order-print.component';
import { AddUserComponent } from 'src/app/components/add-user/add-user.component';
// Models
import { UserModel } from '../../models/user.model';
import { Order } from '../../models/order.model';
// import { File } from '../../models/file.model';
// import { TaskFileList } from '../../models/file-list.model';
// import moment = require('moment');

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  providers: [OrderService, { provide: MAT_DATE_LOCALE, useValue: 'es-ES',  },
  {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},]
})
export class AddTaskComponent implements OnInit {
  // public selectedDate: Date;
  public orderID: string;
  public order: Order;
  public user = new UserModel(null, null, null, null);
  public clients: any[] = [];
  public client: any;
  public searchFromClient = new FormControl();
  selectedClient: UserModel = new UserModel(null, null, null, null);
  public filteredClient: any;
  public fileList = [];
  public total = 0;
  public partialPayment = null;
  public shipping: Boolean = false;
  public shipping_price = null;
  public orderButton: Boolean = false;
  public updateButton: Boolean = false;
  public reloadFiles: Subject<boolean> = new Subject();
  public searchFilter: BehaviorSubject<string> = new BehaviorSubject('');
  public current_branch: any;

  // Date
  public date = new FormControl(new Date(), [ Validators.required ]);
  public selectedDate;
  public endDate = _moment().unix();
  public minDate = new Date();

  // INPUTS
  @ViewChild(FilesComponent, { static: true }) filesComponent;
  @ViewChild(OrderPrintComponent, { static: true}) _orderPrintComponent;
  @ViewChild(AddUserComponent, { static: true}) child: AddUserComponent;
  constructor(
    private _user: UserService,
    private _order: OrderService,
    private _snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this._activatedRoute.params.subscribe(p =>  this.orderID = p['id']);
    this.current_branch = JSON.parse(localStorage.getItem('current_branch'));
  }

  ngOnInit() {
    // Si se recibe un ID de una ordern por parametro de URL para EDITAR
    if (this.orderID) {
      this._order.getOrder(this.orderID, this.current_branch._id).subscribe( (resp: any) => {
        console.log('Respuesta de Orden con ID: ', resp);
        this.total = resp.order.price;
        this.partialPayment = resp.order.partial_payment;
        this.selectedClient = resp.order.client_id;
        this.fileList = resp.order.items;
        this.setClientID = resp.order.client_id._id;
        // console.log('selected', this.selectedClient);
        this.searchFromClient.setValue(this.selectedClient);
        this.updateButton = true;
        this.shipping = resp.order.shipping;
        this.shipping_price = resp.order.shipping_price;
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
      // console.log('Respuesta de getUsers', resp);
      this.clients = resp.users;
      this.filteredClient = resp.users;
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
        // console.log('Entra al reduce');
        file.price ? this.orderButton = true : this.orderButton = false;
        val = val + (file.price * file.quantity);
        return val;
      }, 0);
      if (this.shipping_price) {
        // console.log('Entra al shipping price');
        this.total += this.shipping_price;
        // console.log('Total', this.total);
      }
    }
  }
  
  newOrder(update: boolean = false) {
    // console.log('Update', update);
    if (this.selectedClient && (this.selectedClient.id || this.selectedClient._id) && (this.fileList.length > 0) ) {
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
        shipping: this.shipping,
        shipping_price: this.shipping_price,
        branch_id: this.current_branch._id
      };
      // this.orderButton = true;
      // console.log('Orden ----------');
      // console.log(this.order);
      if (update) {
        console.log('Entra al update');
        this._order.updateOrder(this.order, this.orderID).subscribe( (resp: any) => {
          console.log('UPDATE ORDER: ', resp);
          swal.fire({
            icon: 'info',
            title: 'Orden Actualizada!',
            text: 'Se ACTUALIZÓ orden se imprimirá orden',
            position: 'bottom-end',
            timer: 2000,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: '#d66d00',
            cancelButtonText: 'No imprimir',
          }).then( (result) => {
            if (result.dismiss !== swal.DismissReason.cancel) {
              this._orderPrintComponent.print(resp.updated);
            }
          });
        });
      } else {
        this._order.newOrder(this.order).subscribe( (resp: any) => {
          console.log('Respuesta al agregar orden: ', resp.saved2);
          swal.fire({
            icon: 'success',
            title: 'Orden Creada!',
            text: 'Se ORIGINÓ orden y se imprimirá',
            position: 'bottom-end',
            timer: 1500,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: '#d66d00',
            cancelButtonText: 'No imprimir',
          }).then( (result) => {
            if (result.dismiss !== swal.DismissReason.cancel) {
              this._orderPrintComponent.print(resp.saved2);
            }
          });
        }, err => {
          console.log('Error', err);
        });
      }
      // this._order.getOrder(null, null);
    }
  }

  changeDate(time) {
    // console.log('Time',  _moment(time).unix());
    // console.log('TimeEND',  this.endDate);
    // console.log('DateNow',  Date.now());
    this.endDate = _moment(time).unix();
  }
  // async inputTry() {
  //   const { value: newPerson } = await swal.fire({
  //     icon: 'info',
  //     title: 'Nuevo cliente',
  //     html: 'Ingrese los datos del cliente <br>' +
  //           '<input type="text class="form-control" name="name" id="name" placeholder="Nombre" class="swal2-input">' +
  //           '<input type="text name="surname" id="surname" placeholder="Apellido" class="swal2-input">' +
  //           '<input type="text name="phone" id="phone" value="260-4" placeholder="Teléfono" class="swal2-input"></form>' +
  //           '<input type="email name="email" id="email" placeholder="Email *opcional" class="swal2-input"></form>',
  //     showCancelButton: true,
  //     confirmButtonColor: '#57af04',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Agregar',
  //     footer: '<h3 href>Creador de usuarios</h3>',
  //     focusConfirm: true,
  //     preConfirm: () => {
  //       return [
  //         (document.getElementById('name') as HTMLInputElement).value,
  //         (document.getElementById('surname') as HTMLInputElement).value,
  //         (document.getElementById('phone') as HTMLInputElement).value,
  //         (document.getElementById('email') as HTMLInputElement).value,
  //       ];
  //     },
  //     onOpen: () => {
  //       document.getElementById('name').focus();
  //     },
  //   });
  //   console.log('NewPerson: ', newPerson);
  //   if (newPerson && newPerson[0] && newPerson[1] && newPerson[2]) {
  //     this.user.role = 'CLIENT_ROLE';
  //     this.user.name = newPerson[0];
  //     this.user.surname = newPerson[1];
  //     this.user.phone = newPerson[2];
  //     if (newPerson[3]) { this.user.email = newPerson[3]; }

  //     this._user.newClient(this.user).subscribe( (resp: any) => {
  //       console.log(resp);
  //       this.getUsers();
  //       swal.fire({
  //         icon: 'success',
  //         title: 'Cliente creado',
  //         html: 'Agregado correctamente!<br>' + this.user.name  + ' ' + this.user.surname
  //       } );
  //       this.user = new UserModel(null, null, null, null, null);
  //     }, err => {
  //       swal.fire({
  //         icon: 'error',
  //         title: 'Error al crear cliente',
  //         html: err.error.message + '<br>' + err.error.errors.message
  //       } );
  //     });
  //   }
  // }

  filterFile(value: string) {
    this.searchFilter.next(value);
  }

  displayFnClient(client) {
    if (!client) { return ''; }
    this.selectedClient = undefined;
    return client.name + ' ' + client.surname;
  }

  private _filterClient(value): string[] {
    if (!value) {
      return this.clients;
    }
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
  this.client = client;
  this.selectedClient.id = client._id;
}


totalCheck(e) {
  const value = this.partialPayment;
  if (value >= this.total) {
    event.preventDefault();
    this.partialPayment = this.total;
    // if (totalLength > this.partialPayment.toString().length) {
    //   this.partialPayment = parseInt(value.toString().substring(0, ), 10);
    // } else {

    // }
   
  }
  // if (value > this.total) {
  //   console.log('entra el ifito de value máximun', this.partialPayment, this.total);
  //   this.partialPayment = this.total;
  // }
  // console.log('Event check Total: ', value);
}

checkPartialPayment(e) {
  const value = this.partialPayment;
  if (value > this.total) {
    e.preventDefault();
  }
}

agregarArchivo() {
    swal.fire({
      position: 'bottom-end',
      icon: 'success',
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

addUserDialog(client = null, addType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    console.log('Client: ', client);
    console.log('Tipo: ', addType);
    // return;
    dialogConfig.data = {
      description:  'Ingrese los datos del cliente o del Usuario',
      type: addType,
      client: client
    };
    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    // const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);

    dialogRef.afterClosed().pipe(
      map((data: any) => {
        if (data) {
          if (data.phone) { data.phone = [ data.phone ]; }
          data.email ? data.email = data.email.toLowerCase() : data.email = undefined;
          if (data.branch) {
            data.branch = JSON.parse(localStorage.getItem('user')).user.branch[0]; 
          }
          return data;
        } else {
          return;
        }
      }
      )
    ).subscribe( (resp: any ) => {
      if (resp) {
        console.log('ADDTYPE:', addType);
        console.log('Respuestita: ', resp);
        if (addType === 'Editar') {
           // Update cliente
          this._user.updUser(this.client._id, resp).subscribe( (user: any) => {
            this.getUsers();
            this.client = '';
            this.searchFromClient.reset();
            swal.fire({
              icon: 'info',
              title: 'ACTUALIZADO',
              html: '<p>El usuario se actualizó correctamente:</p>' +
                     `<p class="text-info"> ${user.updated.name + ' ' + user.updated.surname }</p>`,
              timer: 2000,
              position: 'bottom-end'
            });
          });
        } else {
          // Nuevo cliente
          this._user.newClient(resp).subscribe( (user: any) => {
            this.getUsers();
              swal.fire({
                icon: 'success',
                title: 'CREADO',
                html: '<p>El usuario se creó correctamente:</p>' +
                       `<p class="text-green"> ${user.stored.name + ' ' + user.stored.surname }</p>`,
                timer: 2000,
                position: 'bottom-end'
              });
            });
          }
        }
    });
}
}
