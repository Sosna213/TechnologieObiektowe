import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {DatabaseData} from "../../component/database-data-modal/database-data-modal.component";

export type Table = {
  name: string;
  columns: string[];
  primaryKeys: string[];
  foreignKeys: string[];
}

export type DatabaseSchema = {
  tableDTOS: Table[]
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) {
  }

  public getDatabaseSchema(databaseData: DatabaseData): Observable<DatabaseSchema> {
    let databaseSchema = new Subject<DatabaseSchema>();

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('driverClass', databaseData.class);
    params = params.append('databaseURL', databaseData.databaseURL);
    params = params.append('username', databaseData.username);
    params = params.append('password', databaseData.password);
    this.http.get<DatabaseSchema>("/database/schema", { headers: headers, params: params}).subscribe(
      returned => {
        console.log(returned);
        databaseSchema.next(returned);
        return databaseSchema;
      }, error => {
        console.error(error);
      })
    return databaseSchema;
  }

  public getResult(sql: string, databaseData: DatabaseData) {

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('driverClass', databaseData.class);
    params = params.append('databaseURL', databaseData.databaseURL);
    params = params.append('username', databaseData.username);
    params = params.append('password', databaseData.password);
    params = params.append('SQL', sql);

    return this.http.get(`/database/result`, { headers: headers, params: params});
  }
}
