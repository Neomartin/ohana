import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileStatisticsComponent } from 'src/app/components/profile-statistics/profile-statistics.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public localUser;
  constructor() { }
  @ViewChild(ProfileStatisticsComponent, { static: true }) charts;

  ngOnInit() {
    this.localUser = JSON.parse(localStorage.getItem('user'));
  }

  onTabChange(e) {
    if (document.getElementById('sta')) {
      this.charts.changeView([document.getElementById('sta').offsetWidth]);
    }
  }
}
