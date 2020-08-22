import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
// Componentes
import { TaskMenuComponent } from 'src/app/components/task-menu/task-menu.component';
import { OrderPrintComponent } from '../../components/order-print/order-print.component';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogCancelComponent } from '../dialog-cancel/dialog-cancel.component';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  // encapsulation : ViewEncapsulation.None,
})
export class OrdersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['client', 'quantity', 'details', 'status', 'price', 'end_at' ];
  // 'quantity', 'details', 'status', 'price', 'end_at'
  dataSource: MatTableDataSource<any>;
  orders = [];
  ordersSaved = [];
  total: number;
  private subscraib: Subscription;
  public current_branch = null;
  public dateFilter = 'today';
  public today = _moment().unix();
  public end = 1579602556;
  public hora = (1579602556 / (3600)) % 24;
  public expandedElement: any | null;
  public pagination: Array<Number>;
  public createTable = 'loading';
  public currentPage: String = null;
  @ViewChild(OrderPrintComponent, { static: true}) _orderPrintComponent;
  @ViewChild(TaskMenuComponent, { static: true }) _taskMenuComponent;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _order: OrderService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this.current_branch = JSON.parse(localStorage.getItem('current_branch'));
    this.currentPage = this._router.url.replace('/', '');
  } // constructor
  ngOnInit() {
    // Paginación y determinación de ruta para obtener ordenes
    if (this.currentPage === 'home') {
      this.pagination = [10, 20, 40, 50 ];
      this._order.getOrder(null, this.current_branch._id);
      this.subscraib = this.getOrder();
    } else {
      this._order.getOrders(null, this.current_branch._id);
      this.pagination = [ 15, 35, 50, 100];
      this.dateFilter = 'incomplete';
      this.subscraib = this.getOrder();
    }
  }

  getOrder() {
    return this._order.orders.subscribe((resp: any) => {
      console.log('**Resposta', resp);
      // ///// const dateDiff = _moment.unix(this.end).startOf('day').diff(_moment.unix(this.today).startOf('day'), 'days');
      // if (this.dateFilter === 'today'){
      // }
      // this.ordersFiltered = resp.map( (o: any) => o.filter( item => {
      //   console.log('Filtro', o);
      // /////  }));
      // console.log(resp);
        if (resp.order) {
          // console.log('Ordenes obtenidas');
          resp.order.forEach(element => {
            let total = 0;
            for (const key in element) {
              if (key === 'items') {
                total = element[key].reduce( (acc: number, item: any) => {
                  return acc = acc + (item.quantity * item.price);
                }, 0);
                element.total = total;
              }
            }
            });
            this.createTable = 'true';
            this.ordersSaved = resp.order;
            this.filterByDate(resp.order);
            this._taskMenuComponent.ordersQtyToday = this.orders.length;
            this._taskMenuComponent.ordersQtyLater = this.ordersSaved.length - this.orders.length;
            // console.log(this.orders);
            // this.searchFocus();
        }
      }, err => {
        console.log(err);
      }
    );
  }

  // searchFocus(): void {
  //   setTimeout(() => {
  //     document.getElementById('search').focus();
  //   }, 100);
  // }

  reloadTable () {
    this.dataSource = new MatTableDataSource(this.orders);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      const listAsFlatString = (obj): string => {
        let returnVal = '';
        Object.values(obj).forEach((val) => {
          if (typeof val !== 'object') {
            returnVal = returnVal + ' ' + val;
          } else if (val !== null) {
            returnVal = returnVal + ' ' + listAsFlatString(val);
          }
        });
        return returnVal.trim().toLowerCase();
      };
      return listAsFlatString(data).includes(transformedFilter);
    };
  }
  filterByDate(orders) {
    // console.log(orders);
    switch (this.dateFilter) {
      case 'today': {
        // tslint:disable-next-line:max-line-length
        this.orders = orders.filter((item: any) => _moment.unix(item.end_at).startOf('day')
                            .diff(_moment.unix(this.today).startOf('day'), 'days') < 2);
        // this.orders.sort((a, b) =>  (a.))
        this.reloadTable();
        return this.orders;
        break;
      }
      case 'later': {
        // tslint:disable-next-line:max-line-length
        this.orders = orders.filter((item: any) => _moment.unix(item.end_at).startOf('day')
                            .diff(_moment.unix(this.today).startOf('day'), 'days') >= 2);
        this.reloadTable();
        return this.orders;
        break;
      }
      case 'incomplete': {
        this.orders = orders;
        this.reloadTable();
        return this.orders;
        break;
      }
      default: {
        this.orders = orders;
        this.reloadTable();
        return this.orders;
        break;
      }
    }
  }
  applyFilter(filterValue: string) {
    console.log('Entra el filter', filterValue);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  orderStatus(id, status, i) {
    let obs = null;
    // Checkeo si el status es Anular para abrir el modal e ingresar la observación requerida
    if (status === 'cancelled') {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: 'Cancelar orden',
        description:  'Debe agregar una descripción especificacion por que se anula la orden',
        status: status,
        id: id
      };
      console.log('cabceked', status);
      const dialogRef = this._dialog.open(DialogCancelComponent, dialogConfig);

      dialogRef.afterClosed().subscribe( (data: any) => {
        obs = data;
        console.log(id, status, i, obs);
      this._order.orderStatus(id, status, obs).subscribe( (resp: any) => {

        // ****** Cannot reasign resp.updated to orders because isn´t the same object
        // console.log('Update: ', resp);
        // console.log('Previous Object', this.orders[i]);
        // this.orders[i] = resp.updated;
        // console.log('this.Orders[i]', this.orders[i]);


        if (status === 'delivered') {
          this.orders[i].delivered = resp.updated.delivered;
        }
        this.orders[i].status = resp.updated.status;
        this.orders[i].modified_at = resp.updated.modified_at;
        this.orders[i].obs = resp.updated.obs;
        
        this._snackBar.open('Orden cancelada correctamente!', 'CANCELADA',  {duration: 1500, panelClass: 'toast-warning'} );
      }, err => {
        this._snackBar.open('No se pudo cambiar estado de la orden.', 'ERROR');
      });
      });
    } else {
      // ****** Normal update if status isn't 'cancelled'.
      console.log(id, status, i, obs);
      this._order.orderStatus(id, status, obs).subscribe( (resp: any) => {
        // console.log('Update: ', resp);
        if (status === 'delivered') {
          this.orders[i].delivered = resp.updated.delivered;
        }
        this.orders[i].status = resp.updated.status;
        this.orders[i].modified_at = resp.updated.modified_at;
        this._snackBar.open('Orden actualizada correctamente.', 'ESTADO ACTUALIZADO',  {duration: 1500, panelClass: 'toast-success'} );
        // this.orders[i] = resp.updated;
      }, err => {
        this._snackBar.open('No se pudo cambiar estado de la orden.', 'ERROR');
      });
    }
  }

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }

  // editOrder(id) {
  //   console.log('ID');
  //   console.log(id);
  // }
  print(order: any) {
    // console.log('llamado al print', order);
    this._orderPrintComponent.print(order);
  }

    // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    this.subscraib.unsubscribe();
  }
}

