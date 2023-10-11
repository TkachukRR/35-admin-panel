import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { MainPageComponent } from './main-page/main-page.component';
import { EditCreateFormComponent } from './edit-create-form/edit-create-form.component';
import { ValidationErrorDirective } from './directives/validation-error.directive';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    MainPageComponent,
    EditCreateFormComponent,
    ValidationErrorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
