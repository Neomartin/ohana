import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styles: []
})
export class NotFoundComponent implements OnInit {

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    setTimeout( () => {
      this._router.navigateByUrl('/home');
    }, 3000);
  }

}
