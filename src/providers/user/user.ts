import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config/config';
import { Storage } from '@ionic/storage';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  IP: string = config.ip;

  constructor(private http: HttpClient) { }


  getEvents(token) {
    const url = `${this.IP}/user/events`;
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    return this.http.get<any[]>(url, httpOptions);
  }


  updateInfo(data, token) {
    console.log(data)
    console.log(token)
    const url = this.IP + "/user/updateInfo";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    return this.http.put(url, data, httpOptions);
  }

  updateProblem(madata, token) {
    let holder = Array.apply(null, Array());
    let fieldnameArr = Array.apply(null, Array());
    let valuesArr = Array.apply(null, Array())
    madata.forEach(element => {
      element.questions.forEach(element => {
        holder.push(element)
        fieldnameArr.push(element.fieldname + " = ?");
        valuesArr.push(element.value)
      });
    });
    const url = this.IP + "/user/updateProblems";
    const data = {
      holder,
      fieldnameArr,
      valuesArr
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    return this.http.put(url, data, httpOptions);

  }

  updateMoreInfo(data, token) {
    const url = this.IP + "/user/updateMoreInfo";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.put(url, data, httpOptions);

  }


  getInfo(token) {
    const url = this.IP + "/user/getInfo";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.get<Info>(url, httpOptions);

  }

  getUserCode(token) {
    const url = this.IP + "/user/getMyCode";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.get<Sds>(url, httpOptions)
  }

  getMoreInfo(token) {
    const url = this.IP + "/user/getMoreInfo";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.get<MoreInfo>(url, httpOptions);

  }




  getQuestions(token) {
    const url = this.IP + "/user/getQuestions";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.get<Questions[]>(url, httpOptions)

  }
  getProblems(token) {
    const url = this.IP + "/user/getProblems";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.get(url, httpOptions)

  }
  uploadEform(image, token) {

    const url = this.IP + "/user/submitEform";
    const data = new FormData();
    data.append("image", image)
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.post(url, data, httpOptions)
  }

  getEform(token) {
    const url = this.IP + "/user/getEform";
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Access-Control-Allow-Origin': '*'
      })
    }
    return this.http.get<Eform>(url, { headers: httpOptions.headers });

  }
}
interface Eform {
  url: string,
  hasEform: boolean
}

interface Info {
  name: string, course: string, age: number, gender: string, religion: string,
  place_birth: string, addr: string, cp_num: number, mother_name: string,
  mother_religion: string,
  mother_job: string,
  father_name: string,
  father_religion: string,
  father_job: string,
  not_livingwith_parents: string,
  study_status: string,
  transpo: string,
  allowed_night: string,
  study_helper: string,
  hobby: string,
  have_friends: string
}


interface MoreInfo {
  troubling_problems: string,
  someone_to_talk: string,
  happiest_expi: string,
  downful_expi: string,
  ambition: string,
  want_to_change: string

}

interface Sds {
  name: string,
  result: any
}
interface Questions {
  id: number,
  title: string,
  cat: string,
  label: string
}
