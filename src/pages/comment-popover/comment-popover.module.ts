import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentPopoverPage } from './comment-popover';

@NgModule({
  declarations: [
    CommentPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentPopoverPage),
  ],
})
export class CommentPopoverPageModule {}
