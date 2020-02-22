import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  formName = new FormControl('', Validators.required);
  formSurname = new FormControl('', Validators.required);
  formPhone = new FormControl('260-4', Validators.required);
  formEmail = new FormControl('', Validators.required);
  formRole = new FormControl('CLIENT_ROLE', Validators.required);
  formPassword = new FormControl('', Validators.required);
  formPassword2 = new FormControl('', Validators.required);
  formUsername = new FormControl('', Validators.required);
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
        @Inject(MAT_DIALOG_DATA) data
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
      password: this.formPassword
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