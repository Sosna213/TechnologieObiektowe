import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

export type DatabaseData = {
  class: string;
  databaseURL: string;
  username: string;
  password: string;
};

@Component({
  selector: 'app-database-data-modal',
  templateUrl: './database-data-modal.component.html',
  styleUrls: ['./database-data-modal.component.scss']
})
export class DatabaseDataModalComponent implements OnInit {

  databaseData = this.formBuilder.group({
      class: [null, Validators.required],
      databaseURL: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, Validators.required]
    });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DatabaseDataModalComponent>
  ) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onSubmit(){
    const data: DatabaseData = {
      class: this.databaseData.controls['class'].value,
      databaseURL: this.databaseData.controls['databaseURL'].value,
      username: this.databaseData.controls['username'].value,
      password: this.databaseData.controls['password'].value
    }
    this.dialogRef.close(data);
  }

}
