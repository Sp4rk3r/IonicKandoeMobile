//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from '../../model/user'

//import { AppDataService} from "../../services/app-data.service";

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthServiceProvider {
  constructor(private http: HttpClient) {
  }

  login2(username: string, password:string): Observable<any> {
    const credentials = {username: username, password: password};
    const body = JSON.stringify(credentials);
    console.log(body);
    return  this.http.post('https://kandoe-backend.herokuapp.com/token/generate-token', body,httpOptions);
  }

  register2(user: User): Observable<any> {

    let body = JSON.stringify(user);
    console.log(body);
    return this.http.post("https://kandoe-backend.herokuapp.com/register", body, httpOptions);
  }

  public logout() {
    return Observable.create(observer => {
      observer.next(true);
      observer.complete();
    });
  }

}
