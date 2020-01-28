import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-menu',
  templateUrl: './task-menu.component.html',
  styleUrls: [ 'task-menu.component.css' ]
})
export class TaskMenuComponent implements OnInit {
  public date = new Date();
  public ordersQtyToday = 0;
  public ordersQtyLater = 0;
  constructor() { }

  ngOnInit() {
    setInterval( () => {
      this.date = new Date();
    }, 1000);
  }


}
