import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { FilesComponent } from '../files/files.component';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { OriginService } from '../../services/origin/origin.service';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { FileService } from '../../services/file/file.service';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-data-file',
    templateUrl: 'add-file.component.html',
    styleUrls: [ 'add-file.component.css' ],
    providers: [ FileService, OriginService ]
})
export class AddFileComponent implements OnInit {
    @ViewChild(FilesComponent, { static: true }) filesComponent;
    public user: UserModel = new UserModel('', '', '', '', '', '', '', '', '', '');
    public name: String = '';
    public searchClientCtrl = new FormControl();
    public searchFromCtrl = new FormControl();
    public searchCareerCtrl = new FormControl();
    public yearCtrl = new FormControl('', [Validators.required]);
    public persona = false;
    public filteredFrom: any;
    public filteredCareer: any;
    public from = [];
    public career = [];
    public selectedFrom: any;
    public selectedCareer: String;
    public validCareer: Boolean;
    public years = [ 'No corresponde', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 
                     'Sexto', 'Séptimo', 'Inicial', 'Medio', 'Avanzado']
    public yearSelected = 'No corresponde';
    public reloadFiles: Subject<boolean> = new Subject();
    public searchFilter: BehaviorSubject<string> = new BehaviorSubject('');
    
    constructor(
        private _origin: OriginService,
        private _file: FileService
    ) {
      this.yearCtrl.setValue('No corresponde');
    }
    ngOnInit() {
      this.filesComponent.fileListOptions = {
        add: false,
        delete: true
      };
      this.loadFrom();

      this.searchFromCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap(() => {
          this.filteredFrom = [];
        }),
        switchMap((value) => this._filterFrom(value))
      ).subscribe(data => {
        if (data === undefined) {
          this.filteredFrom = this.from;
          // this.from_id = null
        } else {
          this.filteredFrom.push(data);
        }
      });


      this.searchCareerCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        tap(() => {
          this.filteredCareer = [];
        }),
        switchMap((value) => this._filterCareer(value))
      ).subscribe(data => {
        if (data === undefined) {
          this.filteredCareer = this.career;
        } else {
          this.filteredCareer.push(data);
        }
      });
    } // NGONINIT END


    loadFrom() {
      this._origin.getFrom().subscribe((resp: any) => {
        this.from = resp.from;
        this.filteredFrom = resp.from;
        // console.log(resp.from);
      });
    }
    addFrom() {
        swal.mixin({
            input: 'text',
            confirmButtonText: 'Siguiente &rarr;',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            progressSteps: ['1', '2', '3']
          }).queue([
            {
              title: 'LUGAR',
              input: 'select',
              inputOptions: {
                'Universidad': 'Universidad',
                'Instituto': 'Instituto',
                'Colegio': 'Colegio',
                'Escuela': 'Escuela',
                'Institución': 'Institución',
                'Otro': 'Otro'
              },
              inputPlaceholder: 'Seleccione tipo',
            },
            {
              title: 'Número',
              html: 'Ingrese número del colegio/institución' +
                    '<br><span class="bolder text-red">**Si es una universidad agregar <b>Abreviación o Siglas</b>' + 
                    ' (ej. <b class="bolder text-black">UTN</b>)</span>'
            },
            {
              title: 'Nombre',
              text: 'Nombre de la institución'
            }
          ]).then( (result) => {
            console.log('Resultado', result);
            const newFrom: any = {};
            if(!result.dismiss) {
              newFrom.type = result.value[0];
              if (result.value[1]) {
                newFrom.name = result.value[0] + ' - ' + result.value[1] + ' ' + result.value[2];
                newFrom.number = result.value[1];
              } else {
                newFrom.name = result.value[0] + ' - '  + result.value[2];
              }
              result.value[1] ? newFrom.number = result.value[1] : newFrom.number = null;
              console.log(newFrom);
              this._origin.newOrigin(newFrom).subscribe(resp => {
                this.loadFrom();
                swal.fire({
                  title: 'Carga finalizada',
                  html:
                    '<span class="text-green">Carga correcta</span> <pre><code>' +
                      JSON.stringify(newFrom.name) +
                    '</code></pre>'
                });
              },
                error  => {
                  swal.fire({
                    type: 'success',
                    title: 'Carga finalizada',
                    html:
                      '<span class="text-red">Error al agregar institución</span> <pre><code>' +
                        JSON.stringify(newFrom.name) + '<br>' +
                        JSON.stringify(error) +
                      '</code></pre>'
                  });
              });
            }
          });
    }
    addCareer() {
      swal.mixin({
        input: 'text',
        confirmButtonText: 'Siguiente &rarr;',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        progressSteps: [ '1' ]
      }).queue([
        {
          title: 'Agregar Carrera / Curso',
          html: `<span class="text-blue">${this.selectedFrom.name }</span><br>Ingrese nombre de la carrera`
                // '<br><span class="text-red">**Si es una universidad omitir este campo</span>'
        }
      ]).then( (result) => {
        const newCareer = {
          from_id: this.selectedFrom._id,
          name: result.value[0]
        }
        this._origin.newCareer(newCareer).subscribe( (resp: any) => {
          // console.log(resp);
          this.findCareers(this.selectedFrom);
        }, err => {
          // console.log(err);
            swal.fire({
              type: 'error',
              title: 'Oops...',
              html: 'No se agrego <b>carrera</b>! <br>' + 
                    '<span class="text-red">' + err.error.message +'</span>',
            })
        });
      })
    }
    // ***********FILTROS*********** //
    private _filterFrom(value): string[] {
        if (!value) {
          this.searchCareerCtrl.reset();
          this.selectedFrom = null;
        }
        // console.log('ValueFilter: ', value);
        return this.from.filter( (s) => new RegExp(value, 'gi').test(s.name));
      }

    private _filterCareer(value): string[] {
        return this.career.filter( (s) => new RegExp(value, 'gi').test(s.name));
    }

    displayFnFrom(from) {
      // console.log('From ', from);
      if (!from) { return ''; }
      // console.log('From displayFn', from);
      // this.selectedFrom = from;
      return from.name;
    }
    displayFnCareer(career) {
      if (!career) {
        this.selectedCareer = null;
        return ''; }
      // console.log('Career displayFn: ', career);
      // this.career_id = career.id;
      return career.name;
    }


  filterFile(value: string) {
    // if (value.length >= 1) {
      this.searchFilter.next(value);
      // console.log('Entra al next ');
    // }
  }


  findCareers(e) {
    // console.log('entra', e);
    this.selectedFrom = e;
    this.searchCareerCtrl.reset();
    this._origin.findCareers(e._id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.ok) {
        resp.career.length ? this.validCareer = false : this.validCareer = true;
        this.career = resp.career;
        this.filteredCareer = resp.career;
    }
    });
  }

  setCareer(e) {
    this.selectedCareer = e._id;
  }

  ngDoCheck(): void {
    if (this.searchCareerCtrl.value) {
      if (this.searchCareerCtrl.value.hasOwnProperty('_id')) {
        this.validCareer = true;
      }
    }
  }

  send() {
    const newFile = {
      name: this.name,
      status: 'activo',
      year: this.yearCtrl.value,
      from_id: this.selectedFrom._id,
      career_id: this.selectedCareer
    };
    this._file.newFile(newFile).subscribe( (resp: any) => {
      this.reloadFiles.next(true);
      if (resp.ok) {
        swal.fire({
          position: 'bottom-end',
          type: 'success',
          title: resp.message,
          text: resp.saved.name,
          timer: 1000
        }).then(() => {
          // this._file.getFiles();
          this.searchCareerCtrl.reset();
          this.searchFromCtrl.reset();
          this.name = '';
          this.yearCtrl.reset();
          this.persona = false;
        });
      }
    }, err => {
      console.log(err);
      const error = JSON.stringify(err.error.message);
      swal.fire({
        type: 'error',
        title: 'Error al crear archivo',
        html: error + '<br>' + error,
      });
    });
  };
    // this._origin.newFile()

}
