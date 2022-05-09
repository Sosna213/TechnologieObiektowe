import { Component, OnInit } from '@angular/core';
import {DatabaseSchema, DatabaseService, Table} from "../../service/database/database.service";

export type TableColumn = {
  table: string;
  column: string;
  joinOptions?: JoinOption[];
  groupBy?: string;
  join?: string;
  sort?: string;
  show?: boolean;
  where?: string;
}
export type JoinOption = {
  table: string;
  tableToJoin: string;
  foreignKey: string;
  primaryKey: string;
}

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  databaseSchema?: DatabaseSchema;
  dataSelectionOptions: string[] = ['Pole','Tabela','Join','Grupuj według','Sortuj','Pokaż','Kryteria','lub'];
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
  addDataToDisplay(column: string, table: Table){
    const data: TableColumn = {
      table: table.name,
      column: column,
      joinOptions: this.getJoinForTable(table),
      groupBy: 'none',
      join: 'none',
      sort: 'none',
      show: true,
    };
    console.log(data);
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
  getJoinForTable(table: Table): JoinOption[] {
    let joinOptions : JoinOption[] = [];
    table.foreignKeys.forEach(foreignKey => {
      let joinOption = {} as JoinOption;
      joinOption.tableToJoin = foreignKey.split("===")[0].split('---')[0];
      joinOption.primaryKey = foreignKey.split("===")[0].split('---')[1];
      joinOption.foreignKey = foreignKey.split("===")[1].split('---')[1];
      joinOption.table = foreignKey.split("===")[1].split('---')[0];
      joinOptions.push(joinOption);
    })
    return joinOptions;
  }
  generateJoin(join: JoinOption){
    return `JOIN ${join.table} ON ${join.tableToJoin}.${join.foreignKey}=${join.table}.${join.primaryKey}`;
  }
  generateSelectSQL(){
    console.log(`SELECT ${this.getColumns()} FROM ${this.getTables()} \n ${this.getJoins()}`)
  }
  getColumns(): string {
    return this.dataToDisplay.reduce((acc: string, table) => acc ? acc +', ' + `${table.table}.${table.column}` : `${table.table}.${table.column}`,'');
  }
  getTables(): string {
    let tables: Set<string> = new Set<string>();
    this.dataToDisplay.forEach(table => table.join === 'none' ? tables.add(table.table) : '');
    return [...tables].join(', ');
  }
  getJoins(): string {
    let joins: Set<string> = new Set<string>();
    this.dataToDisplay.forEach(table => table.join != 'none' && table.join ? joins.add(table.join) : '');
    return [...joins].join('\n');
  }


}
