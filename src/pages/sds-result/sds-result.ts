import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the SdsResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sds-result',
  templateUrl: 'sds-result.html',
})
export class SdsResultPage {
  userCodes = Array.apply(null, Array());
  isLoaded = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private userProvider: UserProvider
  ) {
    this.storage.get("Authorization").then((authToken) => {
      this.userProvider.getUserCode(authToken).subscribe((successData) => {
        this.userCodes = successData;
        console.log(this.userCodes)
        this.isLoaded = true;
      }, (error) => { console.log(error) });

    }).catch((error) => console.log(error))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SdsResultPage');
  }

}
