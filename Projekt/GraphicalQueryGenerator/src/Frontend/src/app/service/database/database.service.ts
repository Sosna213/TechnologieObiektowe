import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, Subject} from "rxjs";

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

  public getDatabaseSchema(): Observable<DatabaseSchema> {
    let databaseSchema = new Subject<DatabaseSchema>();
    this.http.get<DatabaseSchema>("/database/schema").subscribe(
      returned => {
        console.log(returned);
        databaseSchema.next(returned);
        return databaseSchema;
      }, error => {
        console.error(error);
      })
    return databaseSchema;
  }

  public getResult(sql: string) {
    return this.http.get(`/database/result/${sql}`);
  }
}
