import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentEditModalPage } from './comment-edit-modal';

@NgModule({
  declarations: [
    CommentEditModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentEditModalPage),
  ],
})
export class CommentEditModalPageModule {}
