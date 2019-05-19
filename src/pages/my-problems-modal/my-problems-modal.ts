import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { problems } from '../../app/data/problems';
import { labels } from '../../app/models/problemLabel';
import { title } from '../../app/models/problemTitle';
/**
 * Generated class for the MyProblemsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-problems-modal',
  templateUrl: 'my-problems-modal.html',
})
export class MyProblemsModalPage {
  progress = 0;
  percentage: number;
  holder: Object;
  problems = Array.apply(null, Array())
  slideOpts: Object;
  currentIndex = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastController: ToastController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private storage: Storage,
    private viewController: ViewController,
    private userProvider: UserProvider
  ) {
    this.problems = this.navParams.get("problems");
    this.percentage = 100 / this.problems.length;
  }

  ionViewWillEnter() {
    console.log("will enter")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProblemsModalPage');



    this.slideOpts = {
      effect: 'flip',
      autoHeight: true
    }
  }


  async next() {
    if (this.currentIndex == this.problems.length - 1) {
      console.log(this.problems)
      await this.storage.get("Authorization").then((authToken) => {
        this.presentLoading();
        this.userProvider.updateProblem(this.problems, authToken).subscribe((successData) => {
          console.log(successData)



          this.presentToastWithOptions();
          this.viewController.dismiss({ message: "Updated", isUpdated: true });
        }, (error) => console.log(error))
      })


    } else {
      this.currentIndex++;
      this.progress += this.percentage;
    }

  }

  return() {
    this.viewController.dismiss({ message: "pop", isUpdated: false })

  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Information Updated',
      position: 'top',
      duration: 5000,
    });
    toast.present().catch((error) => { throw error; });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      content: 'Updating...',
      duration: 4000
    });
    return await loading.present();


  }

}
