import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the MyInfoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-info-modal',
  templateUrl: 'my-info-modal.html',
})
export class MyInfoModalPage {
  livingWithParents: Boolean = false;
  allowedDuringNight: Boolean = false;
  haveFriends: Boolean = false;
  bday: String = new Date().toISOString();
  notLive: any;
  allowed: any;
  data = {
    name: "", course: "", age: 0, gender: "", religion: "",
    placeOfBirth: "", addr: "", cpNum: 0, motherName: "",
    motherReligion: "", motherJob: "", fatherName: "",
    fatherReligion: "", fatherJob: "", notLivingWithParents: "",
    studyStatus: "", transpo: "", allowedNight: "",
    studyHelper: "", hobby: "", haveFriends: false, year: ""
  }

  courses = ["BSCS", "BSIT", "ACT", "MAEd", "MAN", "MBM", "MPA", "BSN", "BSM",
    "BSA", "BSBA-FM", "BSBA-HRM", "BSBA-MM", "BSEMC", "BACOM", "BECEd", "BACAEd", "BEEd", "BPEd", "BSEd",
    "BSHM", "BSTM"];
  yearLevel = ["1st", "2nd", "3rd", "4th"];
  userData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private storage: Storage,
    private userProvider: UserProvider,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyInfoModalPage');
    this.getUserData();

  }

  getUserData() {
    this.storage.get("Authorization").then((authToken) => {
      this.userProvider.getInfo(authToken).subscribe((response) => {
        this.userData = response;

        if (this.userData.not_livingwith_parents == "") {
          this.livingWithParents = true;
        } else {
          this.livingWithParents = false;
          this.notLive = this.userData.not_livingwith_parents;
        }
        if (this.userData.allowed_night == "") {
          this.allowedDuringNight = false;
        } else {
          this.allowedDuringNight = true;
          this.allowed = this.userData.allowed_night;
        }

        if (this.userData.have_friends) {
          this.haveFriends = true;
        } else {
          this.haveFriends = false;

        }


        console.log(this.livingWithParents);
      }, err => console.error(err));
    }).catch(err => console.error(err));
  }

  back() {
    console.log("hey")
    this.viewCtrl.dismiss({ message: "pop", isUpdated: false });
  }



  submit(name, course, age, gender, religion,
    placeBirth, addr, cpnum, motherName, motherReligion, motherJob,
    fatherName, fatherReligion, fatherJob, howStudies,
    transpo, hobby, studyHelper, year) {
    let verify = false;
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i] == "" || undefined) {
        verify = false;
        break;
      }
      verify = true;

    }

    if (verify) {
      this.data.name = name; this.data.course = course; this.data.age = age; this.data.gender = gender; this.data.religion = religion;
      this.data.placeOfBirth = placeBirth; this.data.addr = addr; this.data.cpNum = cpnum; this.data.motherName = motherName;
      this.data.motherReligion = motherReligion; this.data.motherJob = motherJob; this.data.fatherName = fatherName;
      this.data.fatherReligion = fatherReligion; this.data.fatherJob = fatherJob; this.data.studyStatus = howStudies;
      this.data.transpo = transpo; this.data.hobby = hobby; this.data.studyHelper = studyHelper; this.data.year = year;

      //Check other requirements
      if (this.livingWithParents == false) { this.data.notLivingWithParents = this.notLive }
      else { this.data.notLivingWithParents = ""; }
      if (this.allowedDuringNight) {
        this.data.allowedNight = this.allowed;
      } else {
        this.data.allowedNight = "";

      }
      if (this.haveFriends) {
        this.data.haveFriends = true
      } else {
        this.data.haveFriends = false
      }
      console.log(this.bday)
      console.log(this.data)
      this.storage.get("Authorization").then((token) => {
        this.userProvider.updateInfo(this.data, token).subscribe((successData) => {
          this.presentToastWithOptions().catch((error) => { throw error });
          this.viewCtrl.dismiss({ message: "Updated", isUpdated: true });
        },
          (error) => console.log(error));

      }).catch((error) => { throw error; });


    } else {
      this.presentAlert("You need to fill all the fields to update your profile");
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

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
