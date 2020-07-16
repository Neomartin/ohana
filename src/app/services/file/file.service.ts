import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL } from '../../config/config';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private headers;
  public URL = URL;
  public files = new BehaviorSubject<any>([]);
  public $files = this.files.asObservable();
  constructor(
    private _http: HttpClient
  ) {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    // this.getFiles();
  }
  getFiles(id: String = null) {
    return this._http.get(URL + '/file', { headers: this.headers });
    // .subscribe( (resp: any) => {
    //   console.log('Service', resp);
    //   // return this.files.next(resp);
    // });
  }

  newFile( newFile: any) {
    console.log(newFile);
    return this._http.post(this.URL + '/file', newFile, { headers: this.headers });
  }

  deleteFile(id: string) {
    return this._http.delete(this.URL + '/file/' + id, { headers: this.headers });
  }
  checkCode(code) {
    console.log('Code service', code);
    return this._http.get(this.URL + '/file/code/' + code, { headers: this.headers });
  }
}
