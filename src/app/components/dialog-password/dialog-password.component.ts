import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-password',
  templateUrl: './dialog-password.component.html',
  styleUrls: ['./dialog-password.component.css']
})
export class DialogPasswordComponent {
  title = 'Cambio de Contraseña';
  userId: string;
  formPassword: FormGroup;
  oldPassword = new FormControl('', Validators.required);
  newPassword = new FormControl('', Validators.required);
  newPassword2 = new FormControl('', Validators.required);
  constructor(
    private _user: UserService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogPasswordComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formPassword = fb.group({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        newPassword2: this.newPassword2
      });
      this.userId = data.id;
    }

  updPassword() {
    console.log('oldPassword', this.oldPassword.value);
    console.log('newPassword', this.newPassword.value);
    this._user.updPassword(this.userId, this.oldPassword.value, this.newPassword.value).subscribe((resp: any) => {
      console.log('Respuesta del servicio: ', resp);
      swal.fire({
         icon: 'success',
         title: 'Modificación Contraseña',
         html: 'La contraseña fue modificada correctamente.',
         timer: 1500,
         onClose: () => {
          this.dialogRef.close(resp);
         }
      }); 
    }, err => {
      console.log('Error', err);
      swal.fire({
         icon: 'error',
         title: 'Error al modificar contraseña.',
         html: '<p class="text-red">' + err.error.message + '</p>',
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
