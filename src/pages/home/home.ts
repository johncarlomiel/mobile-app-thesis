import { Component } from '@angular/core';
import { NavController, MenuController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { LikeProvider } from '../../providers/like/like';
import { CommentProvider } from '../../providers/comment/comment';
import { EventModalPage } from '../event-modal/event-modal';
import * as date_fns from "date-fns";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  notif: any;
  events: any;
  userData: any;
  page = "incoming";
  pastEvents = Array.apply(null, Array())
  incomingEvents = Array.apply(null, Array())
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private userProvider: UserProvider,
    private menuController: MenuController,
    private photoViewer: PhotoViewer,
    private likeProvider: LikeProvider,
    private commentProvider: CommentProvider,
    private modalController: ModalController
  ) {
    console.log(this.notif)
    this.getEvents();

    this.storage.get("user_data").then((userData) => {
      this.userData = userData;
      console.log(this.userData)
    }).catch((error) => console.log(error));


    //Check for new like update
    this.likeProvider.newLike().subscribe((event) => {
      console.log(event)

      for (let index = 0; index < this.events.length; index++) {
        if (this.events[index].event_id == event.event_id) {
          this.events[index].likes_counter = event.likes_counter;


          break;
        }
      }
    });

    // Receive New Comments
    this.commentProvider.receiveNewComment().subscribe((event_with_comment) => {
      for (let index = 0; index < this.events.length; index++) {
        if (this.events[index].event_id == event_with_comment.event.event_id) {
          this.events[index].comments_counter = event_with_comment.event.comments_counter;
          this.events[index].comments.push(event_with_comment.comment);
          break;
        }
      }
    });

    //Receive New COmments from deletion
    this.commentProvider.receiveNewCommentsDeletion().subscribe((event_with_comments) => {
      console.log(event_with_comments)
      for (let index = 0; index < this.events.length; index++) {
        if (this.events[index].event_id == event_with_comments.event.event_id) {
          this.events[index].comments_counter = event_with_comments.event.comments_counter;
          // this.events[index].comments = event_with_comments.comments;

          for (let i = 0; i < this.events[index].comments.length; i++) {
            if (this.events[index].comments[i].comment_id == event_with_comments.comment_id) {
              this.events[index].comments.splice(i, 1);
              console.log(this.events[index].comments[i])
            }
          }
          // console.log(this.events[index])
          break;
        }
      }

    });

    //Receive New Comment From Updating
    this.commentProvider.receiveNewCommentUpdating().subscribe((comment_with_eventInfo) => {
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].event_id == comment_with_eventInfo.event_id) {
          for (let index = 0; index < this.events[i].comments.length; index++) {
            if (this.events[i].comments[index].comment_id == comment_with_eventInfo.comment.comment_id) {
              this.events[i].comments[index] = comment_with_eventInfo.comment;
              break;
            }
          }
          break;
        }

      }
    });
  }



  sendComment(event, comment) {
    this.commentProvider.sendComment(event.event_id, this.userData.id, comment);
  }

  async deleteComment(comment_id, event_id) {




    this.commentProvider.deleteComment(comment_id, event_id);


  }
  like(i) {
    console.log(this.events[i]);
    if (!this.events[i].isLike) {
      this.likeProvider.like(this.events[i].event_id, this.userData.id);
      this.events[i].icon = "heart";
      this.events[i].isLike = !this.events[i].isLike;
    } else {
      this.likeProvider.unlike(this.events[i].event_id, this.userData.index);
      this.events[i].icon = "heart-outline";
      this.events[i].isLike = !this.events[i].isLike;
    }

  }


  unlike(event_id) {
    this.storage.get('Authorization').then((authToken) => {
      this.likeProvider.unlike(event_id, authToken);
    });
  }
  openMenu() {
    this.menuController.open('profileMenu');

  }
  segmentChanged(event) {
    console.log(event)
    this.page = event.value;

  }
  viewPhoto(url, title) {
    let options = {
      share: false,
      closeButton: true
    }
    this.photoViewer.show(url, title, options)
  }


  isPast(event) {
    return date_fns.isPast(event.date);
  }
  isFuture(event) {
    return date_fns.isFuture(event.date);
  }
  durationLastOnline(date) {
    return date_fns.distanceInWordsToNow(date);
  }

  goToEvent(event) {
    console.log(event)
    const modal = this.modalController.create(EventModalPage, { eventInfo: event });
    
    modal.present();
  }

  getEvents() {
    this.storage.get('Authorization').then((authToken) => {
      this.userProvider.getEvents(authToken).subscribe((successData) => {
        this.events = successData;
        console.log(this.events)
        this.events.forEach((element, index) => {
          this.events[index]["seeMore"] = false;
          this.events[index]["isCommentOpen"] = true;
          console.log(this.events[index])
          if (!!this.events[index].user_id) {
            this.events[index]["icon"] = "heart-outline";
            this.events[index]["isLike"] = false;

          } else {
            this.events[index]["icon"] = "heart";
            this.events[index]["isLike"] = true;
          }
        });
        console.log(this.events)
      }, (err => console.error(err)));

    }).catch(err => console.error(err));
  }
  trim(string: string) {
    return string.substring(0, 45);
  }

}
