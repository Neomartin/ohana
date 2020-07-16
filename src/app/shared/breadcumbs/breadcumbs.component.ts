import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { OrderService } from 'src/app/services/order/order.service';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-breadcumbs',
  templateUrl: './breadcumbs.component.html',
  styleUrls: ['./breadcumbs.component.css'],
  encapsulation : ViewEncapsulation.None,
})


export class BreadcumbsComponent implements OnInit {
  public branches = [];
  public current_branch = null;
  public title: String;
  public route: String;
  @Output() branchSelected = new EventEmitter<string>();
  @ViewChild(HomeComponent, {static: true}) _home: HomeComponent;
  constructor(
    private _order: OrderService,
    private _router: Router
  ) {
    this._router.events.subscribe( (val: Event) => {
      // console.log('Testing VAL:', val);
     if (val instanceof NavigationEnd) {
       this.route = val.url;
       const splited = val.url.split('/');
       this.title = splited[1];
     }
    });
    this.current_branch = JSON.parse(localStorage.getItem('current_branch'));
   }

  ngOnInit() {
    this.branches =  JSON.parse(localStorage.getItem('user')).user.branch;

  }
  
  // Orders search based on url All Orders or Filtered
  changeBranch(branch) {
    const page = this._router.url.replace('/', '');
    localStorage.setItem('current_branch',  JSON.stringify(branch));
    this.current_branch = branch;
    this.branchSelected.emit(this.current_branch._id);

    if (page === 'home') {
      this._order.changeBranch(this.current_branch._id);
    } else if (page === 'orders') {
      this._order.changeBranch(this.current_branch._id, true);
    }
  }
  
  
}
