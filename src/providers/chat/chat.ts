import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { config } from '../../config/config';
import * as io from 'socket.io-client';


/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  IP: string = config.ip;
  chatSocket = io(config.ip + "/chat");


  constructor(private http: HttpClient, private storage: Storage) {
    console.log(this.chatSocket);

  }

  sendMessage(msg, token, limit, convo_name) {
    let data = {
      token: token,
      isAdmin: false,
      msg: msg,
      limit: limit,
      convo_name: convo_name
    }
    this.chatSocket.emit('send msg', data);
  }

  login(id) {
    this.chatSocket.emit('login', id);
  }
  logout(data) {
    this.chatSocket.emit('logout', data);
  }
  joinAllContactsRoom(contacts, user_data) {
    contacts.forEach(element => {
      this.chatSocket.emit('join', { convo_name: element.convo_name, user: user_data.username });
    });
  }
  getNewMessages() {
    return new Observable<any[]>((obs) => {
      this.chatSocket.on('new msg', (msgs) => {
        obs.next(msgs);
      });
    });
  }

  getNewInvitation() {
    return new Observable<Event[]>((obs) => {
      this.chatSocket.on('new invitation', (invitations) => {
        obs.next(invitations);
      });
    });
  }
  getNewSingleMessage() {
    return new Observable<Messages>((obs) => {
      this.chatSocket.on('new single message for contact', (msg) => {
        obs.next(msg);
      });
    });
  }

  getNewOnlineUser() {
    return new Observable((obs) => {
      this.chatSocket.on('new online user', (id) => {
        obs.next(id);
      });
    });
  }

  getNewNotification() {
    return new Observable<[Messages]>((obs) => {
      this.chatSocket.on('new message notif', (msg) => {
        obs.next(msg);
      });
    });
  }

  getNewOfflineUser() {
    return new Observable<Offline>((obs) => {
      this.chatSocket.on('new offline user', (id, date) => {
        let data = {
          id, date
        }
        obs.next(data);
      });
    });
  }

  getContacts(token, limit) {
    console.log(limit)
    const url = this.IP + "/user/contacts";
    const params = new HttpParams().set("limit", limit);
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
      params
    }
    return this.http.get<Contacts[]>(url, httpOptions);

  }
  seenAllMessages(token, contact_info) {
    const url = this.IP + "/user/seen";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
    }
    return this.http.post(url, contact_info, httpOptions);
  }

  getNewMessagesForNotif(token, user_id, convo_name) {
    const url = this.IP + "/user/new-messages";
    const params = new HttpParams().set("user_id", user_id)
      .set("convo_name", convo_name);

    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
      params
    }
    return this.http.get<string[]>(url, httpOptions);
  }


  getMessages(token, contact_user_id, convo_name, limit) {
    const url = this.IP + "/user/messages";
    const params = new HttpParams().set("contact_user_id", contact_user_id)
      .set("convo_name", convo_name).set("limit", limit);

    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
      params
    }
    return this.http.get<Messages[]>(url, httpOptions);
  }

}
interface Event {
  created_at: string,
  date: string,
  description: string,
  event_id: number,
  likes_counter: number,
  location: string,
  name: string,
  poster_url: string,
  seeMore: boolean,
  time_from: string,
  time_to: string
}

interface Messages {
  convo_name: string,
  dp_path: string,
  message: string,
  message_id: number,
  name: string,
  timestamp: string,
  id: number,
  isSeen: boolean
}
interface Offline {
  date: string,
  id: number
}
interface Contacts {
  contact_user_id: number,
  convo_name: string,
  dp_path: string,
  isOnline: boolean,
  isSelected: boolean,
  last_online: string,
  name: string,
  recent_msg: string
}
