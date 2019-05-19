import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { MyProblemsModalPage } from '../my-problems-modal/my-problems-modal';
import { problems } from '../../app/data/problems';
import { labels } from '../../app/models/problemLabel';
import { title } from '../../app/models/problemTitle';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the MyProblemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-problems',
  templateUrl: 'my-problems.html',
})
export class MyProblemsPage {
  userProblem: any;
  problem: any;
  labelArray: any;
  problemTitle: any;
  isProblemsUpdated = false;
  containerProblem = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalController: ModalController,
    private storage: Storage,
    private userProvider: UserProvider,
    private viewCtrl: ViewController
  ) {
  }

  async presentProblemModal() {
    const modal = await this.modalController.create(MyProblemsModalPage, { problems: this.containerProblem });
    modal.onDidDismiss((data) => {
      if (data.isUpdated) {
        this.getProblems()
      }
    });
    return await modal.present().catch((error) => { throw error });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProblemsPage');
    this.getProblems();
  }
  back() {
    console.log("hey")
    this.viewCtrl.dismiss({ message: "pop", isUpdated: false });
  }


  getProblems() {
    this.userProblem = Array.apply(null, Array())
    this.storage.get("Authorization").then((authToken) => {
      this.userProvider.getProblems(authToken).subscribe((successData) => {


        this.problem = problems.problems;
        this.labelArray = labels;
        let label_holder = Object.keys(successData);
        label_holder.splice(0, 1)
        let value_holder = Object.keys(successData).map((key) => {
          return successData[key];
        });
        value_holder.splice(0, 1)
        let currentIndex = 0;
        this.problemTitle = new title().title;
        this.containerProblem = new title().title;

        // this.problemTitle.forEach((element, index) => {
        //   if (this.problemTitle[index].questions.length != 0) {
        //     this.problemTitle[index].questions = Array.apply(null, Array())
        //   }
        // });
        // this.problemTitle = this.problemTitle.map(x => ({ name: x.name, questions: Array.apply(null, Array()) }))


        this.labelArray.forEach((element, index) => {



          if (element.fieldname == label_holder[index]) {
            this.labelArray[index].value = value_holder[index]
          }
          if (index == 9) { currentIndex++ }
          else if (index == 14) { currentIndex++ }
          else if (index == 22) { currentIndex++ }
          else if (index == 30) { currentIndex++ }
          else if (index == 37) { currentIndex++ }
          else if (index == 48) { currentIndex++ }
          else if (index == 55) { currentIndex++ }
          else if (index == 60) { currentIndex++ }
          else if (index == 75) {
            currentIndex++;
          } else if (index == 79) {
            currentIndex++;
          }
          if (this.labelArray[index].value) {
            this.problemTitle[currentIndex].questions.push(this.labelArray[index])
          }
          this.containerProblem[currentIndex].questions.push(this.labelArray[index]);



        });


        this.problemTitle.forEach((element, index) => {

          if (element.questions.length > 0) {
            this.userProblem.push(element)
            this.isProblemsUpdated = true;
          }

        });
        console.log(this.containerProblem)







      }, (error) => console.log(error))
    }).catch((error) => console.log(error))



  }





}
