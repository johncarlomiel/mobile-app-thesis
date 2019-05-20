import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, PopoverController, ToastController, ViewController, AlertController } from 'ionic-angular';
import { LikeProvider } from '../../providers/like/like';
import { CommentProvider } from '../../providers/comment/comment';
import { CommentPopoverPage } from '../comment-popover/comment-popover';
import * as date_fns from 'date-fns';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { config } from '../../config/config';
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
  @ViewChild("message") messageBox: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private alertController: AlertController,
    private likeService: LikeProvider,
    private storage: Storage,
    private commentService: CommentProvider,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private viewController: ViewController,
    private socialSharing: SocialSharing
  ) {
    this.eventInfo = this.navParams.get("eventInfo");
    console.log(this.eventInfo)
    this.storage.get("user_data").then((userData) => {
      this.userData = userData;
      console.log(this.userData)
    }).catch((error) => console.log(error));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalPage');

  }

  share(event) {
    this.socialSharing.shareViaFacebookWithPasteMessageHint(event.description, event.poster_url, config.ip + "/public/index.html?id=" + event.event_id, event.name).then((val) => {

    }).catch((err) => console.log(err))
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
    this.presentToast("Comment Added");
    console.log(this.messageBox);
    this.messageBox.value = "";

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
