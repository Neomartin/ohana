import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { multi } from './data';


@Component({
  selector: 'app-profile-statistics',
  templateUrl: './profile-statistics.component.html',
  styleUrls: ['./profile-statistics.component.css']
})
export class ProfileStatisticsComponent implements OnInit {
  multi: any[];
  public view = [];
  model: any;
  // options
  legend = true;
  legendTitle = 'Hola Tsutsana';
  showLabels = true;
  showGridLines = true;
  animations = true;
  rangeFillOpacity = 0.4;
  gradient = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  yAxisLabel = 'Cantidad';
  timeline = true;
  tooltipTemplate = 'Un numero';
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    Object.assign(this, { multi });
    this.model = multi;
  }
  ngOnInit() {
  }
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  public changeView(value) {
    console.log('Valor recibido', value);
    // setTimeout(() => {
      this.view = value;
    // }, 100);
  }

  public saludar() {
    console.log('Saludos delsde el charts');
  }

}

