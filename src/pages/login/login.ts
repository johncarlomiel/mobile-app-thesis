import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ChatProvider } from '../../providers/chat/chat';
import { EventsPage } from '../events/events';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: any;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatProvider: ChatProvider
  ) {
    this.storage.get("Authorization").then((authToken) => {
      if (authToken != null) {

        this.authProvider.checkSession(authToken).subscribe((successData) => {
          console.log(successData)
          this.navCtrl.setRoot(EventsPage)
        },
          (error) => { throw error; });
      }

    }).catch((error) => { throw error });
  }

  ionViewDidLoad() {


    console.log('ionViewDidLoad LoginPage');
  }

  login(username, password) {
    this.presentLoading();
    this.authProvider.login(username, password).subscribe((response) => {
      this.storage.set("Authorization", "Bearer " + response).then(() => {
        this.authProvider.getPayload("Bearer " + response).subscribe((payload) => {
          this.storage.set("user_data", payload).then(() => {
            this.chatProvider.login(payload.id);
            console.log(payload);
            this.loading.dismiss();
            setTimeout(() => {
              this.navCtrl.setRoot(EventsPage);
            }, 100);




          });

        }, err => console.log(err));
      }).catch(err => console.error(err));
    }, err => {
      this.presentAlert();
      this.loading.dismiss();
    });
  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      content: 'Logging In',
      duration: 50000
    });
    return await this.loading.present().catch((error) => { throw error; });
  }
  async presentAlert() {

    const alert = await this.alertController.create({
      title: 'Authentication Error!',
      message: 'Wrong username or password',
      buttons: ['OK']
    });

    await alert.present();
  }

}
