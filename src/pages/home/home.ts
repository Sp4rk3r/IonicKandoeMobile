import { Component, OnInit } from '@angular/core';
import {NavController, IonicPage, ModalController, PopoverController, NavParams} from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {ChatPage} from "../chat/chat";
import {SessionDonePageModule} from "../session-done/session-done.module";
import {SessionDonePage} from "../session-done/session-done";
import {LoginPage} from "../login/login";
import {UserserviceProvider} from "../../providers/userservice/userservice";
import {UseridStorage} from "../../sessionStorage/userid-storage";
import {ActiveSessionPage} from "../active-session/active-session";
import {Session} from "../../model/session";
import {SessionsProvider} from "../../providers/sessions/sessions";
import {Theme} from "../../model/theme";
import {User} from "../../model/user";
import {Phase1Page} from "../phase1/phase1";
import {Phase2Page} from "../phase2/phase2";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UseridStorage, UserserviceProvider]
})
export class HomePage implements OnInit{
  username: string;
  email: string;
  public user : User={id:0,email:'',lastname: '',firstname:'',username:'',password:''};
  public oldSessions = [];
  public plannedSessions = [];
  public currentSessions = [];
  public pastSessions = [];
  public themeId: number;
  userarray: string;

  private afgelopen: SessionDonePageModule;
  sessionId: number;


  constructor(private auth: AuthServiceProvider, public nav: NavController, public popoverCtrl: PopoverController,
              private userservice: UserserviceProvider,
              private useridStorage: UseridStorage,
              public navParams: NavParams,
              private sessionsProvider: SessionsProvider,) {
    this.userservice.getUser(this.useridStorage.getUserId()).subscribe(
      data => {
        this.user = data;
      }, error => {
        alert("Error loading user");
      }
    );
    this.sessionsProvider.getSessionsOfUser(this.useridStorage.getUserId()).subscribe(
      data => {
        this.oldSessions = data;
      },
      error => {
        alert('Error loading sessions');
      },
      () => {
        this.divideSessions();
      }
    );
    this.afgelopen = SessionDonePageModule;
  }


  divideSessions() {
    for (const session of this.oldSessions) {
      if (session.state === 0) {
        this.plannedSessions.push(session);
      }else if (session.state === 1 || session.state === 2 || session.state === 3) {
        this.currentSessions.push(session);
      }else if (session.state === 4) {
        this.pastSessions.push(session);
      }
    }
  }

  ngOnInit() {
    this.userservice.getUser(this.useridStorage.getUserId()).subscribe(
      data => {
        this.user = data;
        console.log(data);
        console.log(this.user);
        this.username = this.user.username;
      },
      error => {
        console.log("Error loading User");
      }
    );
    this.username = this.user.username;

  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.nav.setRoot(LoginPage)
    });
  }

  EnterSessie(session) {
    if (session.state === 1) {
      this.nav.setRoot(Phase1Page, {
        sessionId: session.id
      })
    } else if(session.state === 3) {
      this.nav.setRoot(Phase2Page, {
        sessionId: session.id
      })
    }
  }

  GoToSessionDone() {
    this.nav.setRoot(SessionDonePage);
  }

  openMondal() {
    this.nav.push(ChatPage);
  }
}


