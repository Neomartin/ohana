import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { trigger, transition, style, animate } from '@angular/animations';
import { BranchService } from 'src/app/services/branch/branch.service';
import { Branch } from 'src/app/models/branch.model';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css'],
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
export class AddBranchComponent implements OnInit {
  form: FormGroup;
  // formName;
  // formSurname;
  // formPhone;
  // formEmail;
  // formDir;
  // formDirNumber;
  // formDepartament;
  // formRole;
  // formBranch;
  // formPassword = new FormControl('', Validators.required);
  // formPassword2 = new FormControl('', Validators.required);
  // formUsername;
  public branches: Array<Object> = [];
  public localBranch = JSON.parse(localStorage.getItem('user')).user.branch[0];
  public arrayvacio = [];
  public title: string;
  public text: string;
  // public client: string;
  public type: string;
  public branch: Branch;
  // = new Branch('', '', '' , null, true, '', '')
  public client: any;
  public roles: Role[] =  [
    { value: 'CLIENT_ROLE', viewValue: 'Cliente' },
    { value: 'USER_ROLE', viewValue: 'Usuario' },
    { value: 'ADMIN_ROLE', viewValue: 'Administrador' },
  ];
  constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddBranchComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        private _branches: BranchService
  ) {
    this.title = data.type + ' SUCURSAL';
    this.text = data.text;
    this.type = data.type;
    console.log('Data branch: ', data.branch);
    this.branch = data.branch;
    
    // this.formName = new FormControl(this.client ? this.client.name : '', Validators.required);
    // this.formSurname = new FormControl(this.client ? this.client.surname : '', Validators.required);
    // this.formPhone = new FormControl(this.client ? this.client.phone[0] : '260-4', Validators.required);
    // this.formEmail = new FormControl(this.client ? this.client.email : '', Validators.required);
    // this.formDir = new FormControl(this.client ? this.client.dir : null, Validators.required);
    // this.formDirNumber = new FormControl(this.client ? this.client.dir_num : null, Validators.required);
    // this.formDepartament = new FormControl(this.client ? this.client.departament : null);
    // this.formRole = new FormControl(this.client ? this.client.role : 'CLIENT_ROLE', Validators.required);
    // this.formBranch = new FormControl(this.client ? this.client.branch[0] : this.localBranch, Validators.required);
    // this.formUsername = new FormControl(this.client ? this.client.username : null, Validators.required);
  
    console.log('Branchito incoming:' , this.branch);
   }
  ngOnInit() {
    this.form = this.fb.group({
      name: [ this.branch ? this.branch.name : '', [ Validators.required, Validators.minLength(4)] ],
      adress: [ this.branch ? this.branch.adress : '', [ Validators.required, Validators.minLength(4)] ],
      adress_number: [ this.branch ? this.branch.adress_number : '', [ Validators.required] ],
      location: [ this.branch ? this.branch.location : '', [ Validators.required, Validators.minLength(4)] ],
      phone: [ this.branch ? this.branch.phone : '', [ Validators.required, Validators.minLength(4)] ],
      email: [ this.branch ? this.branch.email : '', [ Validators.email, Validators.minLength(4)] ],
      obs: [ this.branch ? this.branch.obs : '', [ Validators.minLength(4)] ],
    });

    


    // if (this.client) {
    //   this.form = this.branch;
    // }
    // this.form = this.fb.group({
    //   name: this.formName,
    //   surname: this.formSurname,
    //   phone: this.formPhone,
    //   email: this.formEmail,
    //   username: this.formUsername,
    //   role: this.formRole,
    //   password: this.formPassword,
    //   branch: this.formBranch,
    //   dir: this.formDir,
    //   dir_num: this.formDirNumber,
    //   departament: this.formDepartament
    // });
    this._branches.getBranches().subscribe( (resp: any) => {
      console.log('Respuesta branches: ', resp);
      this.branches = resp;
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
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