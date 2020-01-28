import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-print',
  templateUrl: './order-print.component.html',
  styleUrls: [ './order-print.component.css']
})
export class OrderPrintComponent implements OnInit {

  public title;
  public client;
  public order: Order = new Order('', [], '', null, null, null, null);
  constructor() { }

  ngOnInit() {
    
  }

  print(data: any) {
    this.order = data;
    console.log('Data incoming: ', data);
    setTimeout(() => {
      window.print();
    }, 200);
  }

}
