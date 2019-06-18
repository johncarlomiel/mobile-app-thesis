import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LandingPage } from '../pages/landing/landing';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { ChatProvider } from '../providers/chat/chat';
import { MyInfoPage } from '../pages/my-info/my-info';
import { MyInfoModalPage } from '../pages/my-info-modal/my-info-modal';
import { UserProvider } from '../providers/user/user';

import { FormsModule } from "@angular/forms";
import { MyProblemsPage } from '../pages/my-problems/my-problems';
import { MyProblemsModalPage } from '../pages/my-problems-modal/my-problems-modal';
import { AboutMePage } from '../pages/about-me/about-me';
import { AboutMeModalPage } from '../pages/about-me-modal/about-me-modal';

// Natives
import { File } from "@ionic-native/file";
import { FileChooser } from "@ionic-native/file-chooser";
import { FileTransfer } from "@ionic-native/file-transfer";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Camera } from "@ionic-native/camera";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { SocialSharing } from "@ionic-native/social-sharing";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import { EFormPage } from '../pages/e-form/e-form';
import { SdsResultPage } from '../pages/sds-result/sds-result';
import { LikeProvider } from '../providers/like/like';
import { CommentProvider } from '../providers/comment/comment';
import { UserProgressProvider } from '../providers/user-progress/user-progress';
import { InvitationProvider } from '../providers/invitation/invitation';
import { EventModalPage } from '../pages/event-modal/event-modal';
import { CommentPopoverPage } from '../pages/comment-popover/comment-popover';
import { EventsPage } from '../pages/events/events';
import { CommentEditModalPage } from '../pages/comment-edit-modal/comment-edit-modal';
import { MessagesModalPage } from '../pages/messages-modal/messages-modal';
import { ContactsPage } from '../pages/contacts/contacts';
import { InvitationPage } from '../pages/invitation/invitation';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { ComponentsModule } from '../components/components.module';
import { Facebook } from "@ionic-native/facebook";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LandingPage,
    LoginPage,
    MyInfoPage,
    MyProblemsPage,
    AboutMeModalPage,
    AboutMePage,
    EFormPage,
    SdsResultPage,
    CommentPopoverPage,
    EventsPage,
    ContactsPage,
    InvitationPage,
    MyInfoModalPage,
    MyProblemsModalPage,
    EventModalPage,
    CommentEditModalPage,
    MessagesModalPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LandingPage,
    LoginPage,
    MyInfoPage,
    MyProblemsPage,
    AboutMeModalPage,
    AboutMePage,
    EFormPage,
    SdsResultPage,
    CommentPopoverPage,
    EventsPage,
    ContactsPage,
    InvitationPage,
    MyProblemsModalPage,
    EventModalPage,
    CommentEditModalPage,
    MessagesModalPage,
    MyInfoModalPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ChatProvider,
    UserProvider,
    File,
    FileChooser,
    FileTransfer,
    PhotoViewer,
    Camera,
    LikeProvider,
    CommentProvider,
    ChatProvider,
    UserProgressProvider,
    InvitationProvider,
    LocalNotifications,
    Facebook,
    SocialSharing,
    InAppBrowser


  ]
})
export class AppModule { }

