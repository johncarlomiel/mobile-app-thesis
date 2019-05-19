import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { async } from '@angular/core/testing';
import { config } from '../../config/config';
import * as io from 'socket.io-client';

/*
  Generated class for the LikeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LikeProvider {

  IP: string = config.ip;
  likesSocket = io(config.ip + "/likes");
  constructor(private http: HttpClient, private storage: Storage) { }



  like(event_id, user_id) {
    this.likesSocket.emit('like', event_id, user_id, 'like');
  }
  unlike(event_id, user_id) {
    this.likesSocket.emit('like', event_id, user_id, 'unlike');
  }

  newLike(): Observable<any> {
    return Observable.create((obs) => {
      this.likesSocket.on('new like', (event) => {
        obs.next(event);
      });
    });
  }

}
