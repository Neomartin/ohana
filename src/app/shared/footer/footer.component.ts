import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import { BranchService } from 'src/app/services/branch/branch.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent implements OnInit {
  public branch;
  constructor() { }

  ngOnInit() {
    this.branch = JSON.parse(localStorage.getItem('current_branch'));
  }

}
