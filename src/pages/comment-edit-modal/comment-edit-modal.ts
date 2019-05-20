import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { CommentProvider } from '../../providers/comment/comment';

/**
 * Generated class for the CommentEditModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment-edit-modal',
  templateUrl: 'comment-edit-modal.html',
})
export class CommentEditModalPage {
  commentInfo: any;
  eventInfo;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private commentService: CommentProvider,
    private viewController: ViewController
  ) {
    this.commentInfo = this.navParams.get("commentInfo");
    this.eventInfo = this.navParams.get("eventInfo");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentEditModalPage');
  }


  submitEdit(newComment) {
    console.log(newComment)
    this.commentService.editComment(this.commentInfo, this.eventInfo.event_id, newComment);
    this.viewController.dismiss({
      isUpdated: true
    });
  }

  return() {
    this.viewController.dismiss({
      isUpdated: false
    });
  }

}
