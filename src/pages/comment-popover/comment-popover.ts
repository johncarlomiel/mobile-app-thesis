import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, ViewController } from 'ionic-angular';
import { CommentProvider } from '../../providers/comment/comment';
import { CommentEditModalPage } from '../comment-edit-modal/comment-edit-modal';

/**
 * Generated class for the CommentPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment-popover',
  templateUrl: 'comment-popover.html',
})
export class CommentPopoverPage {
  commentInfo: any;
  eventInfo: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private commentService: CommentProvider,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private viewController: ViewController
  ) {
    this.commentInfo = this.navParams.get("commentInfo");
    this.eventInfo = this.navParams.get("eventInfo");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPopoverPage');
  }

  delete() {
    this.commentService.deleteComment(this.commentInfo.comment_id, this.eventInfo.event_id);
    this.viewController.dismiss({
      action: "Comment Deleted Successfully."
    });
  }

  async update() {
    const modal = await this.modalController.create(CommentEditModalPage, { commentInfo: this.commentInfo, eventInfo: this.eventInfo });
    modal.onWillDismiss((val) => {
      console.log(val)
      if (val.isUpdated) {
        this.viewController.dismiss({
          action: "Comment Updated Successfully."
        });
      } else {
        this.viewController.dismiss();
      }
    });
    return await modal.present();
  }

}
