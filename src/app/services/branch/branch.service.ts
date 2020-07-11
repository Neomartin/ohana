import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../config/config';
import { map } from 'rxjs/operators';
import { ReadPropExpr } from '@angular/compiler';
import { Branch } from 'src/app/models/branch.model';

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

    newBranch(branch: Branch) {
        console.log('Branch Incoming: ', branch);
        return this._http.post(this.url + '/branch', branch, { headers: this.headers });
    }
    updBranch(id: String, branch: Branch): Observable<any> {
        return this._http.put(this.url + '/branch/' + id, branch, { headers: this.headers });
    }

    delete(id: String) {
        return this._http.delete(this.url + '/branch/' + id, { headers: this.headers });
    }
}
