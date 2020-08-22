import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-cancel',
  templateUrl: './dialog-cancel.component.html',
  styleUrls: ['./dialog-cancel.component.css']
})
export class DialogCancelComponent implements OnInit {
  public title: String = '';
  public description: String = '';
  public id: String = '';
  public status: String = '';
  public obs = '';
  constructor(
    private dialogRef: MatDialogRef<DialogCancelComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    // console.log('Data in DIALOG', data);
    this.title = data.title;
    this.description = data.description;
    this.id = data.id;
    this.status = data.status;
   }

  ngOnInit(): void {
  }

  update() {
    console.log('llamaado', this.obs);
    this.dialogRef.close(this.obs);
  }
  close() {
    this.dialogRef.close();
}
}
