import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ 'home.component.css'],
  providers: [ OrderService ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['client', 'quantity', 'details', 'status', 'price', 'end_at' ];
  // 'quantity', 'details', 'status', 'price', 'end_at'
  dataSource: MatTableDataSource<any>;
  orders = [];
  ordersSaved = [];
  total: number;
  public dateFilter = 'today';
  public today = _moment().unix();
  public end = 1579602556;
  public hora = (1579602556 / (3600)) % 24;
  public expandedElement: any | null;
  @ViewChild(OrderPrintComponent, { static: true}) _orderPrintComponent;
  @ViewChild(TaskMenuComponent, { static: true }) _taskMenuComponent;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _order: OrderService,
    private _snackBar: MatSnackBar
  ) {
  } // constructor

  ngOnInit() {
    document.getElementById('search').focus();
    this._order.getOrder(null).subscribe( (resp: any) => {
      // const dateDiff = _moment.unix(this.end).startOf('day').diff(_moment.unix(this.today).startOf('day'), 'days');
      // if (this.dateFilter === 'today'){

      // }
      // this.ordersFiltered = resp.map( (o: any) => o.filter( item => {
      //   console.log('Filtro', o);
      // }));
      console.log(resp);
        if (resp.order) {
          console.log('Ordenes obtenidas');
          console.log(resp.order);
          // let i = 0;
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
            // i++;
            });
            this.ordersSaved = resp.order;
            this.filterByDate(resp.order);
            this._taskMenuComponent.ordersQtyToday = this.orders.length;
            this._taskMenuComponent.ordersQtyLater = this.ordersSaved.length - this.orders.length;
            console.log(this.orders);
        }
      }, err => {
        console.log(err);
      });

  }

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
    console.log(orders);
    switch (this.dateFilter) {
      case 'today': {
        // tslint:disable-next-line:max-line-length
        this.orders = orders.filter((item: any) => _moment.unix(item.end_at).startOf('day').diff(_moment.unix(this.today).startOf('day'), 'days') < 2);
        // this.orders.sort((a, b) =>  (a.))
        this.reloadTable();
        return this.orders;
        break;
      }
      case 'later': {
        // tslint:disable-next-line:max-line-length
        this.orders = orders.filter((item: any) => _moment.unix(item.end_at).startOf('day').diff(_moment.unix(this.today).startOf('day'), 'days') >= 2);
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
    console.log(id, status, i);
    this._order.orderStatus(id, status).subscribe( (resp: any) => {
      console.log('Update: ', resp);
      if (status === 'delivered') {
        this.orders[i].delivered = resp.updated.delivered;
      }
      this.orders[i].status = resp.updated.status;
    }, err => {
      this.openSnackBar('No se pudo cambiar estado de la orden.', 'ERROR')
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // editOrder(id) {
  //   console.log('ID');
  //   console.log(id);
  // }
  print(order: any) {
    // console.log('llamado al print', order);
    this._orderPrintComponent.print(order);
  }
}
