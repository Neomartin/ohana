import { Component, OnInit, Inject } from '@angular/core';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BranchService } from 'src/app/services/branch/branch.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  providers: [ BranchService ],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in',
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  formName = new FormControl('', Validators.required);
  formSurname = new FormControl('', Validators.required);
  formPhone = new FormControl('260-4', Validators.required);
  formEmail = new FormControl('', Validators.required);
  formRole = new FormControl('CLIENT_ROLE', Validators.required);
  formBranch = new FormControl(JSON.parse(localStorage.getItem('user')).user.branch[0], Validators.required);
  formPassword = new FormControl('', Validators.required);
  formPassword2 = new FormControl('', Validators.required);
  formUsername = new FormControl('', Validators.required);
  public branches: Array<Object> = [];
  public arrayvacio = [];
  public title: string;
  public text: string;
  public roles: Role[] =  [
    { value: 'CLIENT_ROLE', viewValue: 'Cliente' },
    { value: 'USER_ROLE', viewValue: 'Usuario' },
    { value: 'ADMIN_ROLE', viewValue: 'Administrador' },
  ];
  constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddUserComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private _branches: BranchService
  ) {
    this.title = data.title;
    this.text = data.text;
   }
  ngOnInit() {
    this.form = this.fb.group({
      name: this.formName,
      surname: this.formSurname,
      phone: this.formPhone,
      email: this.formEmail,
      username: this.formUsername,
      role: this.formRole,
      password: this.formPassword,
      branch: this.formBranch
    });
    this._branches.getBranches().subscribe( (resp: any) => {
      console.log('Respuesta branches: ', resp);
      this.branches = resp;
    });
  }
  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

}

export interface Role {
  value: string;
  viewValue: string;
}