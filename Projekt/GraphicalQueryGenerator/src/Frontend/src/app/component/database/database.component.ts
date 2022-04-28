import { Component, OnInit } from '@angular/core';
import {DatabaseSchema, DatabaseService, Table} from "../../service/database/database.service";

export type TableColumn = {
  table: string;
  column: string;
}

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSchema?: DatabaseSchema;
  dataSelectionOptions: string[] = ['Pole','Tabela','Suma','Sortuj','Pokaż','Kryteria','lub'];
  tablesToDisplay: Set<Table> = new Set<Table>();
  dataToDisplay: Array<TableColumn> = new Array<TableColumn>();

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
  addDataToDisplay(column: string, table: string){
    const data: TableColumn = {
      table: table,
      column: column
    };
    if(!this.dataToDisplay.reduce((contains: boolean, tableData) => JSON.stringify(tableData) === JSON.stringify(data) ? true : contains, false)){
      this.dataToDisplay.push(data);
    }
  }
  checkIsPrimaryKey(table: Table, column: string){
    return table.primaryKeys.reduce((isPrimary: boolean ,primaryKey) => primaryKey.split('===')[0] === column ? true : isPrimary , false);
  }
  checkIsForeignKey(table: Table, column: string){
    return table.foreignKeys.reduce((isForeign: boolean ,foreignKey) => foreignKey.split('===')[1].split('---')[1] === column ? true : isForeign , false);
  }

}
