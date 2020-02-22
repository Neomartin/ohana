import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public localUser;
  constructor() { }

  ngOnInit() {
    this.localUser = JSON.parse(localStorage.getItem('user'));
  }

}
