import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyInfoModalPage } from './my-info-modal';

@NgModule({
  declarations: [
    MyInfoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MyInfoModalPage),
  ],
})
export class MyInfoModalPageModule {}
