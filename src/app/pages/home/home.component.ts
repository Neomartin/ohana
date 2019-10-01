import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { scan } from 'rxjs/operators';

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
  providers: [ OrderService ]
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['client',  'quantity', 'details', 'status', 'price', 'end_at'];
  dataSource: MatTableDataSource<any>;
  orders = [];
  total: number;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _order: OrderService,
  ) {
    this._order.getOrder().subscribe( (resp: any) => {
        if (resp.order) {
          // console.log(resp.order);
          let i = 0;
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
            i++;
            });
            this.orders = resp.order;
            console.log(this.orders);
          
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
      }, err => {
        console.log(err);
      });
  } // constructor

  ngOnInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  orderStatus(id, status) {
    console.log(id, status);
  }

}
