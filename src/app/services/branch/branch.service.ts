import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../config/config';
import { map } from 'rxjs/operators';
import { ReadPropExpr } from '@angular/compiler';

@Injectable()
export class BranchService {
    public url = URL;
    private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    constructor(
        private _http: HttpClient
    ) {}

    getBranches(): Observable<any[]> {
        return this._http.get<any[]>(this.url + '/branch', { headers: this.headers}).pipe(
            map( (resp: any) => {
                return resp.branch;
            })
        );
    }
}
