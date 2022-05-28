import {Component, OnInit} from '@angular/core';
import {DatabaseSchema, DatabaseService, Table} from "../../service/database/database.service";
import {map} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ResultModalComponent} from "../result-modal/result-modal.component";

export type TableColumn = {
  table: string;
  column: string;
  joinOptions?: JoinOption[];
  groupBy: string;
  join?: string;
  sort: string;
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
  dataSelectionOptions: string[] = ['Pole', 'Tabela', 'Dołącz', 'Grupuj według', 'Sortuj', 'Pokaż', 'Kryteria'];
  tablesToDisplay: Set<Table> = new Set<Table>();
  dataToDisplay: Array<TableColumn> = new Array<TableColumn>();

  constructor(private databaseService: DatabaseService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.databaseService.getDatabaseSchema().subscribe(data => {
      this.databaseSchema = data;

    }, error => {
      console.error(error);
    });
  }

  addTableToDisplay(table: Table) {
    this.tablesToDisplay.add(table);
  }

  addDataToDisplay(column: string, table: Table) {
    const data: TableColumn = {
      table: table.name,
      column: column,
      joinOptions: this.getJoinForTable(table),
      groupBy: 'none',
      join: 'none',
      sort: 'none',
      show: true,
    };
    if (!this.dataToDisplay.reduce((contains: boolean, tableData) => JSON.stringify(tableData) === JSON.stringify(data) ? true : contains, false)) {
      this.dataToDisplay.push(data);
    }
  }

  deleteDataToDisplay(data: TableColumn){
    this.dataToDisplay = this.dataToDisplay.filter(table => table != data);
  }

  deleteTableToDisplay(table: Table){
    this.tablesToDisplay.delete(table);
  }

  openResultDialog(result: any){
    const dialogRef = this.dialog.open(ResultModalComponent, {
      width: '1300px',
      data: {result: result},
    });
  }

  checkIsPrimaryKey(table: Table, column: string) {
    return table.primaryKeys.reduce((isPrimary: boolean, primaryKey) => primaryKey.split('===')[0] === column ? true : isPrimary, false);
  }

  checkIsForeignKey(table: Table, column: string) {
    return table.foreignKeys.reduce((isForeign: boolean, foreignKey) => foreignKey.split('===')[1].split('---')[1] === column ? true : isForeign, false);
  }

  getJoinForTable(table: Table): JoinOption[] {
    let joinOptions: JoinOption[] = [];
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

  generateJoin(join: JoinOption) {
    return `WHERE ${join.tableToJoin}.${join.primaryKey}=${join.table}.${join.foreignKey}`;
  }

  generateSelectSQL() {
    const sqlQuery = `SELECT ${this.getColumns()} FROM ${this.getTables()} ${this.getJoins()} GROUP BY ${this.getGrouping()} ${this.checkExists(('HAVING'))} ${this.getHaving()} ${this.checkExists(('ORDER BY'))} ${this.getSorting()}`;
    this.databaseService.getResult(sqlQuery).subscribe(
      result => {
        this.openResultDialog(result);
      }
    )
  }

  checkExists(condition: string) {
    switch (condition) {
      case 'ORDER BY':
        return this.dataToDisplay.reduce((acc: boolean, table) => table.sort != 'none' ? true : acc, false) ? `\nORDER BY` : '';
      case 'HAVING':
        return this.dataToDisplay.reduce((acc: boolean, table) => table.where ? true : acc, false) ? `\nHAVING` : '';
      default:
        return '';
    }
  }

  getHaving(): string {
    return this.dataToDisplay.reduce((acc: string, table) => table.where ? (acc ? acc + ' OR ' + `${this.checkGrouping(table)}(${table.table}.${table.column})${table.where}` : `${this.checkGrouping(table)}(${table.table}.${table.column})${table.where}`) : acc, '');
  }

  getColumns(): string {
    return this.dataToDisplay.reduce((acc: string, table) => table.show ? (acc ? acc + ', ' + `${this.checkGrouping(table)}(${table.table}.${table.column})` : `${this.checkGrouping(table)}(${table.table}.${table.column})`) : acc, '');
  }

  getSorting(): string {
    return this.dataToDisplay.reduce((acc: string, table) => acc ? acc + this.checkSorting(table, true) : this.checkSorting(table, false), '');
  }

  checkSorting(table: TableColumn, comma: boolean): string {
    switch (table.sort) {
      case 'none':
        return '';
      case 'asc' :
        return comma ? `,${this.checkGrouping(table)}(${table.table}.${table.column})` : `${this.checkGrouping(table)}(${table.table}.${table.column})`;
      case 'desc' :
        return comma ? `,${this.checkGrouping(table)}(${table.table}.${table.column}) DESC` : `${this.checkGrouping(table)}(${table.table}.${table.column}) DESC`;
      default:
        return '';
    }
  }

  checkGrouping({groupBy}: TableColumn): string {
    return groupBy != 'none' ? groupBy : '';
  }

  getGrouping() {
    return this.dataToDisplay.reduce((acc: string, table) => acc ? acc + this.checkIsGrouped(table, true) : this.checkIsGrouped(table, false), '');
  }

  checkIsGrouped(table: TableColumn, comma: boolean): string {
    return table.groupBy === 'none' ? comma ? `,${table.table}.${table.column}` : `${table.table}.${table.column}` : '';
  }

  getTables(): string {
    let tables: Set<string> = new Set<string>();
    this.dataToDisplay.forEach(table => tables.add(table.table));
    return [...tables].join(', ');
  }

  getJoins(): string {
    let joins: Set<string> = new Set<string>();
    this.dataToDisplay.forEach(table => table.join != 'none' && table.join ? joins.add(table.join) : '');
    return [...joins].join('\n');
  }


}
