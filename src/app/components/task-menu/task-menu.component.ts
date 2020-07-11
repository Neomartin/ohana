import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: [ 'task-menu.component.css' ]
})
export class TaskMenuComponent implements OnInit {
  public date = new Date();
  public ordersQtyToday = 0;
  public ordersQtyLater = 0;
  public allOrders = false;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    // Type of Route
    this._router.url.replace('/', '') === 'orders' ? this.allOrders = true : this.allOrders = false;
    setInterval( () => {
      this.date = new Date();
    }, 1000);
  }


}
