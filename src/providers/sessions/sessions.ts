import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Session} from "../../model/session";
import {SessionState} from "../../model/SessionState";
import {JwtHelper} from "angular2-jwt";
import {Observable} from "rxjs/Observable";
import {SessionCard} from "../../model/sessionCard";

/*
  Generated class for the SessionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class SessionsProvider {
  sessions: Session[] = [];
  jwtHelper: JwtHelper = new JwtHelper();
  accesToken: string;


  constructor(private http: HttpClient) {
  }

  getSessions(userId: number): Observable<any> {
    return this.http.get('https://kandoe-backend.herokuapp.com/users/' + userId +'/sessions');
  }

  getThemeOfSession(themeId: number, userId: number): Observable<any> {
    return this.http.get('https://kandoe-backend.herokuapp.com/users/' + userId + '/themes/' + themeId);
  }

  getSessionsOfUser(userId: number): Observable<any> {
    return this.http.get('https://kandoe-backend.herokuapp.com/users/' + userId + '/sessions');
  }

  updateSession(session: Session, userId: number): Observable<any> {
    const body = JSON.stringify(session);
    return this.http.put('https://kandoe-backend.herokuapp.com/users/' + userId + '/sessions/' + session.id, body, httpOptions);
  }

  getSession(id: number, userId: number): Observable<any> {
    return this.http.get('https://kandoe-backend.herokuapp.com/users/' + userId + '/sessions/' + id);
  }

  saveSessionCards(cardIds: number[], sessionId: number ,userId: number): Observable<any> {
    const body = JSON.stringify(cardIds);
    return this.http.post('https://kandoe-backend.herokuapp.com/users/' + userId + '/sessions/' + sessionId + '/saveCards', body, httpOptions);
  }

  saveSelectedCard(selectedCard: SessionCard, sessionId: number, userId: number): Observable<any> {
    const body = JSON.stringify(selectedCard);
    return this.http.put('https://kandoe-backend.herokuapp.com/users/' + userId + '/sessions/' + sessionId + '/sessionCards/' + selectedCard.id, body, httpOptions);
  }

  endSession(sessionId: number, userId: number): Observable<any> {
    return this.http.post('https://kandoe-backend.herokuapp.com/users/' + userId + '/sessions/' + sessionId + '/endSession', httpOptions);
  }
}




