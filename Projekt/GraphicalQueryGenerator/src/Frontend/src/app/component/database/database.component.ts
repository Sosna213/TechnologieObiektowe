import { Component, OnInit } from '@angular/core';
import {DatabaseSchema, DatabaseService, Table} from "../../service/database/database.service";

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSchema?: DatabaseSchema;
  tablesToDisplay: Set<Table> = new Set<Table>();
  columnToDisplay: Set<string> = new Set<string>();

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.getDatabaseSchema().subscribe(data =>{
      this.databaseSchema = data;

    }, error => {
      console.error(error);
    });
  }
  addTableToDisplay(table: Table){
    console.log(this.databaseSchema)
    this.tablesToDisplay.add(table);
  }
  addColumnToDisplay(column: string){
    this.columnToDisplay.add(column);
  }
  checkIsPrimaryKey(table: Table, column: string){
    return table.primaryKeys.reduce((isPrimary: boolean ,primaryKey) => primaryKey.split('===')[0] === column , false);
  }

}
