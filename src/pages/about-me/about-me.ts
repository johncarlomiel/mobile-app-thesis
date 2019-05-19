import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AboutMeModalPage } from '../about-me-modal/about-me-modal';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the AboutMePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-me',
  templateUrl: 'about-me.html',
})
export class AboutMePage {
  moreInfo: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private storage: Storage,
    private userProvider: UserProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutMePage');
    this.getMoreUserInfo();
  }

  async presentMoreInfoModal() {
    const modal = await this.modalController.create(AboutMeModalPage, { moreInfo: this.moreInfo });
    modal.onDidDismiss(() => {
      this.getMoreUserInfo();
    });
    return await modal.present().catch((error) => { throw error });

  }


  getMoreUserInfo() {
    this.storage.get("Authorization").then((authToken) => {
      //Getting user more information
      this.userProvider.getMoreInfo(authToken).subscribe((successData) => {
        this.moreInfo = Array.apply(null, Array());
        let moreInfoLabels = [
          "My ambition in life is to be/become",
          "My downful experience", "My happiest experience",
          "Someone i can talk to about my problems",
          "Problems that are troubling me the most",
          "I want to change my"
        ]
        let moreInfoValue = Object.keys(successData).map((key) => {
          return successData[key];
        });
        moreInfoValue.forEach((element, index) => {
          this.moreInfo.push({ label: moreInfoLabels[index], value: element });
        });
        console.log(this.moreInfo)
      }, (error) => { throw error; });

      //Getting user more information
    }).catch((error) => console.log(error))
  }

}
