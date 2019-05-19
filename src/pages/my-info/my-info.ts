import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MyInfoModalPage } from '../my-info-modal/my-info-modal';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the MyInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-info',
  templateUrl: 'my-info.html',
})
export class MyInfoPage {
  info: any;
  infoLabel = [
    "Full name", "Year Level", "Course", "Age", "Gender", "Religion", "Place of Birth", "Address", "Phone Number", "Mother's Name",
    "Mother's Religion", "Mother's Occupation", "Father's Name", "Father's Religion", "Father's Job",
    "Are you living with your parents?", "How is your studies?", "How do you go to school?", "Are you allowed to go out night?",
    "Who help you in your studies?", "What are your hobbies during your free time?", "Do you have any friends in school?"
  ];
  userInfo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private storage: Storage,
    private userProvider: UserProvider
  ) {
  }

  ionViewDidLoad() {
    this.info = [];
    this.getUserInfo();
    console.log('ionViewDidLoad MyInfoPage');
  }

  async presentInfoModal() {
    const modal = await this.modalController.create(MyInfoModalPage, { data: this.userInfo });

    modal.onDidDismiss((data) => {
      console.log(data);
      if (data.isUpdated) {
        this.getUserInfo();
      }
    });
    await modal.present();

  }

  getUserInfo() {
    this.info = Array.apply(null, Array())
    this.storage.get("Authorization").then((authToken) => {
      //Getting user information


      this.userProvider.getInfo(authToken).subscribe((successData) => {
        console.log(successData)
        this.userInfo = successData;
        if (successData.have_friends) {
          successData.have_friends = "I do have";
        } else {
          successData.have_friends = "I don't have";
        }

        if (successData.not_livingwith_parents == "") {
          successData.not_livingwith_parents = "Yes";
        }
        if (successData.allowed_night == "") successData.allowed_night = "No";

        let arrayHolder = Object.keys(successData).map((key) => {
          return successData[key];
        });

        arrayHolder.forEach((element, index) => {
          this.info.push({ label: this.infoLabel[index], value: element });

        });

        console.log(this.info)

      }, (error) => console.log(error))
      //Getting user information





    }).catch((error) => { throw error; })
  }

}
