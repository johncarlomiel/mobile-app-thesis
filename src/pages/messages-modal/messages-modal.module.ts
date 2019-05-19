import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesModalPage } from './messages-modal';

@NgModule({
  declarations: [
    MessagesModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagesModalPage),
  ],
})
export class MessagesModalPageModule {}
