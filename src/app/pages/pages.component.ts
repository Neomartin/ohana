import { Component, OnInit } from '@angular/core';
// declare function jquery ();
declare function init_plugins();
// declare function bootstrap();
// declare function dateMaterial();
// declare function bootstrap();
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // jquery();
    init_plugins();
    // dateMaterial();
    // bootstrap();
  }

}
