import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-breadcumbs',
  templateUrl: './breadcumbs.component.html',
  styleUrls: ['./breadcumbs.component.css'],
  encapsulation : ViewEncapsulation.None,
})


export class BreadcumbsComponent implements OnInit {
  public branches = [];
  public current_branch = null;
  @Output() branchSelected = new EventEmitter<string>();
  @ViewChild(HomeComponent, {static: true}) _home: HomeComponent;
  constructor(
    private _order: OrderService
  ) {
    this.current_branch = JSON.parse(localStorage.getItem('current_branch'));
   }

  ngOnInit() {
    this.branches =  JSON.parse(localStorage.getItem('user')).user.branch;
  }
  
  changeBranch(branch) {
    // console.log('BranchitoSlectifasad', branch);
    localStorage.setItem('current_branch',  JSON.stringify(branch));
    this.current_branch = branch;
    this.branchSelected.emit(this.current_branch._id);
    // this._home.test('Hola');
    this._order.changeBranch(this.current_branch._id);
  }
}
