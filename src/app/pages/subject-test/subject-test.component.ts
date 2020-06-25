import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-subject-test',
  templateUrl: './subject-test.component.html',
  styleUrls: ['./subject-test.component.css']
})
export class SubjectTestComponent implements OnInit {
  orders: any;
  constructor(
    private _order: OrderService
  ) { }

  ngOnInit(): void {
    this._order.orders.subscribe((resp: any) => {
      console.log('Subscripcion de respuesta: ', resp.order);
      this.orders = resp.order;
    });
  }

}
