import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProblemsPage } from './my-problems';

@NgModule({
  declarations: [
    MyProblemsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyProblemsPage),
  ],
})
export class MyProblemsPageModule {}
