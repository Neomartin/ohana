import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FileService } from '../../services/file/file.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  providers: [ FileService ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FilesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Output() emitAddFileToTask: EventEmitter<any> = new EventEmitter()
  // Initialize dataSource
  @Input() reload: Subject<boolean>;
  @Input() file: Subject<string>;
  // dataSource;
  public filterito = '';
  public fileListOptions = {
    add: false,
    delete: false
  };
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = [
    'name', 'from_id', 'year', 'edit'
  ];
  expandedElement: File | null;
  files: Array<Object> = [];
  constructor(
    public _file: FileService
  ) { }


  ngOnInit() {
    this.getFiles();
    this.reload.subscribe(v => {
      this.getFiles();
    });
    console.log(this.fileListOptions);
  }  // ***** END OF NGINIT

    getFiles() {
      this._file.getFiles().subscribe( (resp: any ) => {
        console.log(resp);
        resp.files.forEach(element => {
          if (element.hasOwnProperty('created_at')) {
            element['created_at'] = moment.unix(element['created_at'] / 1000).format('DD/MM/YYYY');
          }
        });
        this.dataSource = new MatTableDataSource(resp.files);
        // this.dataSource.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // ****** filtro con Input desde parent
        this.file.subscribe( (value: string) => {
          // this.filterito = value;
          // console.log('llaamdo', this.filterito);
          this.applyFilter(value);
        });
        this.dataSource.filterPredicate = (data, filter: string) => {
          const transformedFilter = filter.trim().toLowerCase();
          const listAsFlatString = (obj): string => {
            let returnVal = '';
            Object.values(obj).forEach((val) => {
              if (typeof val !== 'object') {
                returnVal = returnVal + ' ' + val;
              } else if (val !== null) {
                returnVal = returnVal + ' ' + listAsFlatString(val);
              }
            });
            return returnVal.trim().toLowerCase();
          };
          return listAsFlatString(data).includes(transformedFilter);
        };
        // this.dataSource = resp.files;
      }, err => {
        err = JSON.stringify(err);
        console.log(err);
        swal.fire({
          icon: 'error',
          title: 'Error al obtener archivos',
          text: err
        });
      });
    }
    applyFilter(filterValue: string) {
      // console.log('Entra', filterValue);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    addFileToTask(file: any) {
      // console.log('add file to task', file);
      this.emitAddFileToTask.emit(file);
    }
    deleteFile(file) {
      console.log(file);
      swal.fire({
        icon: 'warning',
        title: 'Desea eliminar archivo?',
        html: 'Esta a punto de eliminar el siguiente archivo: <br>' +
              '<span class="text-blue">' + file.name + '</span>',
        showCancelButton: true,
        confirmButtonText: 'Si, borrar!',
        cancelButtonText: 'Cancelar!',
        cancelButtonColor: '#dd3333',
        // reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this._file.deleteFile(file._id).subscribe( resp => {
            this.getFiles();
            // console.log(resp);
            swal.fire({
              position: 'bottom-end',
              icon: 'success',
              title: 'Borrado correctamente',
              html: '<span class="text-red">' + file.name + '</span>',
              timer: 1200
            });
          });
        } else if (
          result.dismiss === swal.DismissReason.cancel
        ) {
          swal.fire(
            'Cancelado',
            'El archivo se encuentra a salvo :)',
            'error'
          );
        }
      });
    }
}

export interface File {
  name: string;
  year: number;
  status: string;
  created_at: any;
  _id: string;
}

