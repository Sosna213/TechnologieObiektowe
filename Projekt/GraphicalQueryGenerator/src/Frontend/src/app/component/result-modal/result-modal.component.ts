import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss']
})
export class ResultModalComponent implements OnInit {

  columns: Set<string> = new Set;

  constructor(
    public dialogRef: MatDialogRef<ResultModalComponent>,
    @Inject(MAT_DIALOG_DATA) public result: any
  ) {
  }

  ngOnInit(): void {
    [...this.result.result].forEach(result => {
      for (let name in result){
        this.columns.add(name);
      }
    });
  }

}
