import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InvitationProvider } from '../../providers/invitation/invitation';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the InvitationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invitation',
  templateUrl: 'invitation.html',
})
export class InvitationPage {
  invitations: Array<any>
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private invitationService: InvitationProvider,
    private toastController: ToastController,
    private photoViewer: PhotoViewer
  ) {

    this.getPendingInvitations();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvitationPage');
  }
  viewPhoto(url, title) {
    let options = {
      share: false,
      closeButton: true
    }
    this.photoViewer.show(url, title, options)
  }
  accept(event_id) {
    this.storage.get("Authorization").then((authToken) => {
      this.invitationService.acceptInvitation(authToken, event_id).subscribe((res) => {
        console.log(res);
        this.presentToast();
        this.getPendingInvitations();

      }, (err) => console.log(err));

    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Invitation Response Submitted',
      duration: 3000,
      position: "top"
    });
    toast.present();
  }
  decline(event_id) {
    this.storage.get("Authorization").then((authToken) => {
      this.invitationService.declineInvitation(authToken, event_id).subscribe((res) => {
        console.log(res);
        this.presentToast();
        this.getPendingInvitations();

      }, (err) => console.log(err));

    });
  }

  getPendingInvitations() {
    this.storage.get("Authorization").then((authToken) => {
      this.invitationService.getPendingInvitation(authToken).subscribe((invitations) => {
        this.invitations = invitations;
        console.log(this.invitations)
      }, (err) => console.log(err));
    });
  }
  trim(string: string) {
    return string.substring(0, 45);
  }

}
