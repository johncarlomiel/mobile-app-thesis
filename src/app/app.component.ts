import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform, NavController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LandingPage } from '../pages/landing/landing';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { MyInfoPage } from '../pages/my-info/my-info';
import { MyProblemsPage } from '../pages/my-problems/my-problems';
import { AboutMePage } from '../pages/about-me/about-me';
import { EFormPage } from '../pages/e-form/e-form';
import { SdsResultPage } from '../pages/sds-result/sds-result';


import { ChatProvider } from '../providers/chat/chat';
import { ContactsPage } from '../pages/contacts/contacts';
import { EventsPage } from '../pages/events/events';
import { InvitationPage } from '../pages/invitation/invitation';
import { UserProgressProvider } from '../providers/user-progress/user-progress';
import { LocalNotifications, ILocalNotificationActionType } from '@ionic-native/local-notifications';
import { InvitationProvider } from '../providers/invitation/invitation';
import { MessagesModalPage } from '../pages/messages-modal/messages-modal';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  user_data: any;
  chatSocket: any;
  progress: any;
  isQualified = false;
  showSplash = true;
  contacts: any;
  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userProgService: UserProgressProvider,
    private chatService: ChatProvider,
    private localNotifications: LocalNotifications,
    private modalController: ModalController,
    private invitationService: InvitationProvider,
    private zone: NgZone
  ) {
    this.initializeApp();
    this.storage.keys().then((keys) => {
      console.log(keys)
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Information', component: MyInfoPage, icon: "information" },
      { title: 'My Problems', component: MyProblemsPage, icon: "quote" },
      { title: 'About Me', component: AboutMePage, icon: "quote" },
      { title: 'Enrollment Form', component: EFormPage, icon: "camera" },
      { title: 'SDS Result', component: SdsResultPage, icon: "school" },
      { title: 'Contacts', component: ContactsPage, icon: "contacts" },
      { title: 'Events', component: EventsPage, icon: "calendar" },
      { title: 'Invitations', component: InvitationPage, icon: "notifications" },
    ];

    this.storage.get("isSlidesSeen").then((isSeen) => {
      console.log(isSeen)
      if (isSeen) {
        this.rootPage = LoginPage
      } else {
        this.rootPage = LandingPage
      }
    }).catch(err => console.error(err));


  }

  refreshUserData() {
    this.zone.run(async () => {
      try {
        this.user_data = await this.storage.get("user_data");
      } catch (error) {

      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();





      this.storage.get('user_data').then((data) => {
        if (!!data.id) {
          this.chatService.login(data.id);
        }
        this.user_data = data;
        this.storage.get("Authorization").then((authToken) => {
          this.joinAllContactsRoom(authToken);
          this.getNewMessagesForNotif(authToken);
          this.getNewInvitations(authToken);

          console.log(authToken)
          this.chatService.getNewInvitation().subscribe((invitations) => {
            console.log(invitations);
            this.localNotifications.hasPermission().then((granted) => {
              if (!granted) {
                this.localNotifications.requestPermission();
              } else {
                invitations.forEach((element, index) => {
                  this.localNotifications.schedule({
                    id: index + 1,
                    title: `You are invited to an event: ${element.name}`,
                    icon: element.poster_url,
                    text: element.time_from + " - " + element.time_to,
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    data: { event_id: element.event_id, authToken: authToken },
                    actions: [
                      { id: 'yes', title: 'Accept', type: ILocalNotificationActionType.BUTTON },
                      { id: 'no', title: 'Decline', type: ILocalNotificationActionType.BUTTON }
                    ]
                  })
                });
              }
            })
          }, (err) => console.log(err));



          this.localNotifications.on('click').subscribe((notif) => {
            if (notif.data.contact_user_id && notif.data.convo_name && notif.data.contact_name) {
              this.messageModal(notif.data.contact_user_id, notif.data.convo_name, notif.data.contact_name);
            } else {
              this.nav.setRoot(InvitationPage)

            }
          });
          this.localNotifications.on('yes').subscribe((notif) => {
            this.invitationService.acceptInvitation(notif.data.authToken, notif.data.event_id).subscribe((res) => alert(res.message), (err) => alert(JSON.stringify(err)));
          });
          this.localNotifications.on('no').subscribe((notif) => {
            this.invitationService.declineInvitation(notif.data.authToken, notif.data.event_id).subscribe((res) => alert(res.message), (err) => alert(JSON.stringify(err)));;
          });



        });

      }).catch((err) => console.log(err));


    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }






  getNewInvitations(authToken) {
    this.invitationService.getPendingInvitation(authToken).subscribe((invitations) => {
      this.localNotifications.hasPermission().then((granted) => {
        if (!granted) {
          this.localNotifications.requestPermission();
        } else {
          let notif = [];

          invitations.forEach((element, index) => {
            notif.push({
              title: `You are invited to an event: ${element.name}`,
              id: index + 1,
              icon: element.poster_url,
              text: element.time_from + " - " + element.time_to,
              sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
              data: { event_id: element.event_id, authToken },
              actions: [
                { id: 'yes', title: 'Accept', type: ILocalNotificationActionType.BUTTON },
                { id: 'no', title: 'Decline', type: ILocalNotificationActionType.BUTTON }
              ]
            });


          });
          this.localNotifications.schedule(notif)
        }
      })
    }, (err) => console.log(err));
  }

  getNewMessagesForNotif(authToken) {
    this.chatService.getContacts(authToken).subscribe((responseData) => {
      this.contacts = responseData;
      console.log(this.contacts)



      this.localNotifications.hasPermission().then((granted) => {
        if (!granted) {
          this.localNotifications.requestPermission();
        } else {

          responseData.forEach((element, index) => {
            this.chatService.getNewMessagesForNotif(authToken, element.contact_user_id, element.convo_name)
              .subscribe((resData) => {
                console.log(element);
                if (resData.length != 0) {

                  this.localNotifications.schedule({
                    title: `Message From ${element.name}`,
                    icon: element.dp_path,
                    id: index + 1,
                    text: resData,
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    data: { convo_name: element.convo_name, contact_user_id: element.contact_user_id, contact_name: element.name },
                  })

                }

              });
          });
        }
      })







    }, (err) => console.log(err));
  }
  async messageModal(contact_user_id, convo_name, contact_name) {
    const modal = await this.modalController.create(MessagesModalPage, { contact_user_id, convo_name, contact_name, user_data: this.user_data });
    return await modal.present().catch((error) => { throw error });

  }


  joinAllContactsRoom(authToken) {
    this.chatService.getContacts(authToken).subscribe((responseData) => {
      //Join all of the conversion room for every contact user
      console.log(this.user_data);
      this.chatService.joinAllContactsRoom(responseData, this.user_data);


      this.chatService.getNewNotification().subscribe((responseData) => {
        console.log(responseData);
        let messages = responseData.reverse();
        this.localNotifications.hasPermission().then((granted) => {
          if (!granted) {
            this.localNotifications.requestPermission();
          } else {
            let notificationTexts = [];
            messages.forEach(element => {
              notificationTexts.push({ person: element.name, message: element.message });
            });

            this.localNotifications.schedule(
              {
                id: 2,
                title: `Message From ${responseData[0].name}`,
                icon: responseData[0].dp_path,
                text: notificationTexts,
                sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                data: { convo_name: responseData[0].convo_name, contact_user_id: responseData[0].id, contact_name: responseData[0].name },




              }
            );

          }
        })
      }, (err) => console.log(err));


    }, (err) => console.log(err));

  }

  logout() {
    // this.chatSocket.emit('logout', this.user_data.id);
    this.storage.get('Authorization').then((authToken) => {
      this.chatService.getContacts(authToken).subscribe(async (contacts) => {
        try {
          let user_data = await this.storage.get("user_data");
          console.log(user_data);
          contacts.forEach(element => {
            let data = {
              id: user_data.id,
              convo_name: element.convo_name
            }
            this.chatService.logout(data);
          });
        } catch (error) {

        }




        await this.storage.remove("Authorization");
        await this.storage.remove("user_data");
        this.nav.setRoot(LoginPage);
      });
    });






  }
}
