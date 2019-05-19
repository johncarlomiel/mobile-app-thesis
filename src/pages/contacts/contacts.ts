import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { MessagesModalPage } from '../messages-modal/messages-modal';
import * as date_fns from 'date-fns';
/**
 * Generated class for the ContactsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
  contacts = [];
  user_data: any;
  chatSocket: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: ChatProvider,
    private storage: Storage,
    private modalController: ModalController,
    private authService: AuthProvider
  ) {
  }

  ionViewDidEnter() {
    this.getContacts();

  }
  async messageModal(contact_user_id, convo_name, contact_name) {
    const modal = await this.modalController.create(MessagesModalPage, { contact_user_id, convo_name, contact_name, user_data: this.user_data });
    modal.onDidDismiss(() => {
      this.getContacts();
    });
    return await modal.present().catch((error) => { throw error });

  }

  getContacts() {
    this.storage.get("Authorization").then((authToken) => {
      this.authService.getPayload(authToken).subscribe((successData) => {
        this.user_data = successData;
        console.log(this.user_data)
        this.chatService.getContacts(authToken).subscribe((successData) => {
          console.log(successData);
          this.contacts = successData;
          //Join all of the conversion room for every contact user
          this.chatService.joinAllContactsRoom(this.contacts, this.user_data);
          this.chatService.getNewSingleMessage().subscribe((msg) => {
            if (this.contacts.some((contact) => contact.convo_name === msg.convo_name)) {
              for (const key in this.contacts) {
                if (this.contacts[key].convo_name === msg.convo_name) {
                  this.contacts[key].recent_msg = msg.message;
                  break;
                }
              }
            }
          });

          this.chatService.getNewOnlineUser().subscribe((id) => {
            if (this.contacts.some((contact) => contact.contact_user_id === id)) {
              for (const key in this.contacts) {
                //Check if it the id 
                //If not continue to next iteration
                if (this.contacts[key].contact_user_id === id) {
                  this.contacts[key].isOnline = true;
                  break;
                } else {
                  continue;
                }
              }
            }
          });

          this.chatService.getNewOfflineUser().subscribe((data) => {
            if (this.contacts.some((contact) => contact.contact_user_id === data.id)) {
              for (const key in this.contacts) {
                //Check if it the id 
                //If not continue to next iteration
                if (this.contacts[key].contact_user_id === data.id) {
                  this.contacts[key].isOnline = false;
                  this.contacts[key].last_online = data.date;
                  break;
                } else {
                  continue;
                }
              }
            }
          });



        }, (error) => console.log(error))
      }, (error) => console.log(error))
    }).catch((err) => console.log(err))
  }
  durationLastOnline(date) {
    return date_fns.distanceInWordsToNow(date);
  }

}
