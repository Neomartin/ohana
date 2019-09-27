import { Injectable } from '@angular/core';
import { URL } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = URL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private _http: HttpClient
  ) { }
  
  getOrder(id: String = null) {
    return this._http.get(this.url + '/order');
  }
  
}
