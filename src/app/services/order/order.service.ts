import { Injectable } from '@angular/core';
import { URL } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map, mapTo } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { HomeComponent } from 'src/app/pages/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = URL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  // $orders = new BehaviorSubject([]);
  $orders = new Subject();
  orders = this.$orders.asObservable();
  branch;
  constructor(
    private _http: HttpClient,
    // private _home: Orders2Component
  ) {
    this.branch = JSON.parse(localStorage.getItem('current_branch'));
  }

  getOrder(id: String = null, branch: String) {
    // filtro como parametro de getOrder
    // console.log('Branch to find: ', branch);
    // branch ? branch = branch : branch = this.branch;
    if (id) {
      return this._http.get(this.url + '/order/' + branch + '/' + id);
    }
    // else {
    //   return this._http.get(this.url + '/order/' + branch);
    // }
    this._http.get(this.url + '/order/' + branch).subscribe((resp: any ) => {
      // console.log('En teoría entra aquí: ', resp);
      this.$orders.next(resp);
      return;
    });

  }
  getOrders(parameters = null, branch: String) {
    // filtro como parametro de getOrder
      this._http.post(this.url + '/orders/' + branch, parameters , { headers: this.headers }).subscribe((resp: any) => {
          this.$orders.next(resp);
          // this._home.searchFocus();
      });
  }
  newOrder(order) {
    this.getOrder(null, this.branch._id);
    return this._http.post(URL + '/order', order, { headers: this.headers });
  }
  orderStatus(id: string, status: string) {
    const url = URL + '/order/' + id + '/' + status;
    return this._http.put( url , { headers: this.headers });
  }
  updateOrder(order: Order, id: String) {
    console.log('Order Service: ', order);
    return this._http.put(URL + '/order/' + id, order, { headers: this.headers });
  }

  changeBranch(branch: String, all: boolean = false) {
    all ? this.getOrders(null, branch) : this.getOrder(null, branch);
  }
}
