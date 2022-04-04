import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";

export type DatabaseSchema = {
  tableDTOS: {
    name: string;
    columns: string[];
    primaryKeys: string[];
    foreignKeys: string[];
  }[]
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
}
