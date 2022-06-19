import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {DatabaseComponent} from "./component/database/database.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ResultModalComponent } from './component/result-modal/result-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import { DatabaseDataModalComponent } from './component/database-data-modal/database-data-modal.component';
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";

@NgModule({
    declarations: [
        AppComponent,
        DatabaseComponent,
        DatabaseComponent,
        ResultModalComponent,
        DatabaseDataModalComponent
    ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
