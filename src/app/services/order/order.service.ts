import { Injectable } from '@angular/core';
import { URL } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map, mapTo } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = URL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private _http: HttpClient,
    // private _headers: HttpHeaders
  ) { }
  
  getOrder(id: String = null ) {
    // filtro como parametro de getOrder
    if (id) {
      console.log('Entra al if de recibir ID SERVICE');
      return this._http.get(this.url + '/order/' + id);
    } else {
      return this._http.get(this.url + '/order');
    }
  }
  newOrder(order) {
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
}
