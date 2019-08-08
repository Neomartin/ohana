//app.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
 
import { debounceTime, tap, switchMap, finalize, startWith } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';
 
 
@Component({
  selector: 'app-root',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.sass']
})
export class AutocompleteComponent implements OnInit {
  searchMoviesCtrl = new FormControl();
  filteredMovies: any;
  isLoading = false;
  errorMsg: string;
  options = [];
  constructor(
    private http: HttpClient,
    private _user: UserService
  ) { }
 
  ngOnInit() {
    this._user.users.subscribe(resp => {
      console.log(resp);
      resp.forEach(element => {
        for (const key in element) {
          if (element.hasOwnProperty(key) && key === 'name') {
            const name = element[key];
            this.options.push(name);
          }
        }
      });
      this.filteredMovies = this.options;
      console.log('Creacion filtered: ', this.filteredMovies);
      // this.options.push(...resp);
    });
    this.searchMoviesCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        tap(() => {
          this.errorMsg = '';
          this.filteredMovies = [];
          // console.log('Filtered: ', this.filteredMovies);
          // this.isLoading = true;
          // console.log(ev);
        }),
        switchMap((value) => this._filter(value))
        )
      .subscribe(data => {
        // console.log('Entra aca');
        // console.log('DATA: ', data);
        if (data === undefined) {
          this.errorMsg = data['Error'];
          this.filteredMovies = this.options;
        } else {
          this.errorMsg = '';
          this.filteredMovies.push(data);
        }
        console.log(this.filteredMovies);
      });
  }
  private _filter(value): string[] {
    // console.log('Options: ', this.options);
    // console.log('Value: ', value);
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
 