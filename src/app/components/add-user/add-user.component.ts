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
  formName;
  formSurname;
  formPhone;
  formEmail;
  formDir;
  formDirNumber;
  formDepartament;
  formRole;
  formBranch;
  formPassword = new FormControl('', Validators.required);
  formPassword2 = new FormControl('', Validators.required);
  formUsername;
  public branches: Array<Object> = [];
  public localBranch = JSON.parse(localStorage.getItem('user')).user.branch[0];
  public arrayvacio = [];
  public title: string;
  public text: string;
  // public client: string;
  public type: string;
  public client: any;
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
    this.title = data.type + ' usuario.';
    this.text = data.text;
    this.type = data.type;
    this.client = data.client;
    this.formName = new FormControl(this.client ? this.client.name : '', Validators.required);
    this.formSurname = new FormControl(this.client ? this.client.surname : '', Validators.required);
    this.formPhone = new FormControl(this.client ? this.client.phone[0] : '260-4', Validators.required);
    this.formEmail = new FormControl(this.client ? this.client.email : '', Validators.required);
    this.formDir = new FormControl(this.client ? this.client.dir : null, Validators.required);
    this.formDirNumber = new FormControl(this.client ? this.client.dir_num : null, Validators.required);
    this.formDepartament = new FormControl(this.client ? this.client.departament : null);
    this.formRole = new FormControl(this.client ? this.client.role : 'CLIENT_ROLE', Validators.required);
    this.formBranch = new FormControl(this.client ? this.client.branch[0] : this.localBranch, Validators.required);
    this.formUsername = new FormControl(this.client ? this.client.username : null, Validators.required);
  
    console.log('Clientito:' , this.client);
   }
  ngOnInit() {
    if (this.client) {
      this.form = this.client;
    }
    this.form = this.fb.group({
      name: this.formName,
      surname: this.formSurname,
      phone: this.formPhone,
      email: this.formEmail,
      username: this.formUsername,
      role: this.formRole,
      password: this.formPassword,
      branch: this.formBranch,
      dir: this.formDir,
      dir_num: this.formDirNumber,
      departament: this.formDepartament
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
  incoming(data) {
    console.log('Data incoming from Parent', data);
  }
}

export interface Role {
  value: string;
  viewValue: string;
}