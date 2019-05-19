import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the AboutMeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-me-modal',
  templateUrl: 'about-me-modal.html',
})
export class AboutMeModalPage {
  moreInfo: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastController: ToastController,
    private storage: Storage,
    private userProvider: UserProvider
  ) {
    this.moreInfo = navParams.get("moreInfo");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutMeModalPage');
  }

  submit() {
    let verify = false;
    for (let i = 0; i < this.moreInfo.length; i++) {
      if (this.moreInfo[i].value == "" || undefined) {
        verify = false;
        break;
      }
      verify = true;

    }
    if (verify) {
      let data = {
        ttroubling: this.moreInfo[0].value,
        friends: this.moreInfo[1].value,
        happy_expi: this.moreInfo[2].value,
        downful_expi: this.moreInfo[3].value,
        ambition: this.moreInfo[4].value,
        change: this.moreInfo[5].value
      }
      this.storage.get("Authorization").then((authToken) => {
        this.userProvider.updateMoreInfo(data, authToken).subscribe((successData) => {
          this.presentToastWithOptions().catch((error) => { throw error; });
          this.viewCtrl.dismiss({ message: "pop", isUpdated: false });
        }, (error) => { throw error })
      }).catch((error) => { throw error; })
    } else {
      alert("Please fill all questions");

    }

  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Information Updated',
      position: 'top',
      duration: 2000,
    });
    toast.present().catch((error) => { throw error });
  }

  back() {
    this.viewCtrl.dismiss({ message: "pop", isUpdated: false });
  }

}
