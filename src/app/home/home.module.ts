import { NgModule } from "@angular/core";
import { SigninComponent } from "./signin/signin.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ SigninComponent ],
    imports: [ CommonModule, ReactiveFormsModule ]
})
export class HomeModule { }