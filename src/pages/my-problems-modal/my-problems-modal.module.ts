import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProblemsModalPage } from './my-problems-modal';
@NgModule({
  declarations: [
    MyProblemsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProblemsModalPage)
  ]
})
export class MyProblemsModalPageModule { }
