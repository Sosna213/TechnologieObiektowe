import { Component, OnInit } from '@angular/core';
import {DatabaseSchema, DatabaseService} from "../../service/database/database.service";

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSchema?: DatabaseSchema;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.getDatabaseSchema().subscribe(data =>{
      this.databaseSchema = data;
    }, error => {
      console.error(error);
    });
  }

}
