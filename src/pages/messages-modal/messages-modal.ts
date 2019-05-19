import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll, } from "ionic-angular";
import { IonicPage, Content, Platform, ModalController, ViewController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { ChatProvider } from './../../providers/chat/chat';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as date_fns from 'date-fns';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the MessagesModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages-modal',
  templateUrl: 'messages-modal.html',
})
export class MessagesModalPage {
  contact_user_id: any;
  convo_name: any;
  contact_name: any;
  user_data: any;
  @ViewChild('message') messageBox: any;
  @ViewChild(Content) content: Content;
  scroller: InfiniteScroll
  messages = [];
  messages_storage = [];
  isOnline = false;
  chatSocket: any;
  counter = 0;
  isLoading = true;
  limit = 10;
  isNew = false;
  currentDataLength = 10;

  mutationObserver: MutationObserver;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private chatService: ChatProvider,
    private storage: Storage,
    private authService: AuthProvider,
    private localNotifications: LocalNotifications,
    private platform: Platform,
    private viewController: ViewController
  ) {

    this.contact_user_id = this.navParams.get("contact_user_id");
    this.convo_name = this.navParams.get("convo_name");
    this.contact_name = this.navParams.get("contact_name");
    this.user_data = this.navParams.get("user_data");
    this.getMessages();


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesModalPage');
    this.seenAllMessages();
    this.storage.get("Authorization").then((val) => {
      this.chatService.getNewMessages().subscribe((msgs) => {
        this.chatService.getMessages(val, this.contact_user_id, this.convo_name, this.limit).subscribe((response) => {
          this.isLoading = true;

          this.currentDataLength = response.length;
          this.messages = response.reverse();
          if (!!this.content) {
            console.log("Scrolling to bottom")
            this.content.scrollToBottom(0);
          }
          setTimeout(() => {

            this.isLoading = false;
            console.log("loading now functioning")
          }, 500)
          // console.log(msgs)
        }, err => console.error(err));

        // this.isLoading = true;

        // this.currentDataLength = msgs.length;
        // this.messages = msgs.reverse();
        // this.content.scrollToBottom(0);




        // setTimeout(() => {

        //   this.isLoading = false;
        //   console.log("loading now functioning")
        // }, 500)
        // console.log(msgs)
      });
    }).catch((err) => console.error(err));



    //Event that receive new message from server

  }
  seenAllMessages() {
    this.storage.get("Authorization").then((authData) => {
      let contact_info = {
        contact_user_id: this.contact_user_id,
        convo_name: this.convo_name
      }
      this.chatService.seenAllMessages(authData, contact_info).subscribe((responseData) => {
        console.log(responseData);


      }, (err) => console.log(err));
    });
  }

  ionViewDidEnter() {
    console.log("loaded")
    this.content.scrollToBottom(0).then((data) => this.isLoading = false).catch((err) => console.log("error"))


  }
  ionViewWillEnter(): void {


  }
  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/shame.mp3'
    } else {
      return 'file://assets/sounds/bell.mp3'
    }
  }

  sendMessage(msg) {
    this.messageBox.value = "";

    this.storage.get("Authorization").then((authToken) => {

      this.chatService.sendMessage(msg, authToken, this.limit, this.convo_name);
    }).catch((err) => console.log(err));
  }

  loadData(event) {

    this.scroller = event;
    if (!this.isLoading) {
      if (this.limit <= this.currentDataLength) {
        this.limit += 10;
        this.storage.get("Authorization").then((authData) => {

          this.chatService.getMessages(authData, this.contact_user_id, this.convo_name, this.limit)
            .subscribe((successData) => {
              this.currentDataLength = successData.length;
              this.messages = successData.reverse();
              event.complete();

            }, (error) => console.log(error));



        }).catch((err) => console.log(err))
      } else {
        console.log("tapos na")
        event.enable(false);
        event.complete();
      }

    }
  }

  getMessages() {
    this.isNew = true;
    this.storage.get("Authorization").then((authToken) => {
      this.chatService.getMessages(authToken, this.contact_user_id, this.convo_name, this.limit)
        .subscribe((successData) => {
          console.log(successData);
          this.currentDataLength = successData.length;
          console.log(this.messages_storage)
          this.messages = successData.reverse();
          setTimeout(() => this.isNew = false, 500)
        }, (error) => console.log(error));
    }).catch((err) => console.log(err))
  }





  return() {
    this.viewController.dismiss({ message: "pop" })

  }

  convertDate(date) {
    return date_fns.format(date, 'MMMM Do YYYY hh:mm A');
  }
  processDate(date, index) {
    if (index % 5 == 0) {
      return date_fns.format(date, "hh mm A");
    } else {
      return '';
    }
  }

}
