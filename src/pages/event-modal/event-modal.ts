import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, ToastController, ViewController } from 'ionic-angular';
import { LikeProvider } from '../../providers/like/like';
import { CommentProvider } from '../../providers/comment/comment';
import { CommentPopoverPage } from '../comment-popover/comment-popover';
import * as date_fns from 'date-fns';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the EventModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {
  eventInfo: any;
  userData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private likeService: LikeProvider,
    private storage: Storage,
    private commentService: CommentProvider,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private viewController: ViewController
  ) {
    this.eventInfo = this.navParams.get("eventInfo");
    this.storage.get("user_data").then((userData) => {
      this.userData = userData;
      console.log(this.userData)
    }).catch((error) => console.log(error));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalPage');

  }
  return() {

    this.viewController.dismiss();

  }

  trim(string: string) {
    return string.substring(0, 45);
  }
  durationLastOnline(date) {
    return date_fns.distanceInWordsToNow(date);
  }

  sendComment(event, comment) {
    this.commentService.sendComment(event.event_id, this.userData.id, comment);
  }

  async showPopover(comment, event) {
    const popover = await this.popoverController.create(CommentPopoverPage, {
      commentInfo: comment,
      eventInfo: this.eventInfo
    });
    popover.onDidDismiss((val) => {
      console.log(val)
      if (!!val) {
        this.presentToast(val.action);
      }
    });
    return await popover.present({ ev: event });
  }



  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  like() {
    console.log(this.eventInfo);
    if (!this.eventInfo.isLike) {
      this.likeService.like(this.eventInfo.event_id, this.userData.id);
      this.eventInfo.icon = "heart";
      this.eventInfo.isLike = !this.eventInfo.isLike;
    } else {
      this.likeService.unlike(this.eventInfo.event_id, this.userData.index);
      this.eventInfo.icon = "heart-outline";
      this.eventInfo.isLike = !this.eventInfo.isLike;
    }

  }

}
