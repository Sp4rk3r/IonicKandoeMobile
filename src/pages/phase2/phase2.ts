import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {SessionsProvider} from "../../providers/sessions/sessions";
import {CardserviceProvider} from "../../providers/cardservice/cardservice";
import {UseridStorage} from "../../sessionStorage/userid-storage";
import {Session} from "../../model/session";
import {ChatPage} from "../chat/chat";

import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {SessionCard} from "../../model/sessionCard";
import {LoginPage} from "../login/login";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {Ring} from "../../model/ring";
import {MenuPage} from "../menu/menu";

/**
 * Generated class for the Phase2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phase2',
  templateUrl: 'phase2.html',
})
export class Phase2Page{
  private gameIsFinished: boolean;
  private earlyStop: boolean;
  public sessionId;
  public maxProgres = 8;
  public userId;
  public session = new Session(0, '', 0, 0, 0, 0, 0, [''], [''], [], [], 0, [], null, false, new Date(), false, 0,  0);
  public cards = [];
  public selectedCard = new SessionCard(null, '', '', '', 0, 0, 0, 0);
  @Input() sessionCards;
  @Input() currentUserTurnId;
  public isMyTurn = true;
  public index;
  public valueProgress = [];
  public winningCards = [];
  createSuccess = false;
  private stompClient;
  private serverUrl = 'https://kandoe-backend.herokuapp.com/socket';


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private sessionService: SessionsProvider,
              private userIdStorage: UseridStorage,
              private cardService: CardserviceProvider,
              private popoverCtrl: PopoverController,
              private auth: AuthServiceProvider,
              private alertCtrl: AlertController) {
    this.sessionId = this.navParams.get("sessionId");
    this.userId = this.userIdStorage.getUserId();

    this.sessionService.getSession(this.sessionId, this.userId).subscribe(
      data => {
        this.session = data;
      },
      error => {
        alert("Error loading session");
      }, () => {
        this.cardService.getCardsByCategory(this.session.categoryId, this.session.themeId, this.userId).subscribe(
          data => {
            this.cards = data;
            this.sessionCards = this.session.sessionCardDtos;
          },
          error => {
            alert("Error loading cards");
          }
        )
      }
    );
    console.log('SessionCards: ' + this.sessionCards);
    this.initializeWebSocketConnection(this.sessionId, this.userId, this);
  }

  openMondal(sessionId: number) {
    this.navCtrl.push(ChatPage, {
      sessionIdParam : sessionId,
    });
  }

  confirmMoveCard() {
    console.log("Kaart versturen: " + this.selectedCard.name);
    this.sessionService.saveSelectedCard(this.selectedCard, this.sessionId, this.userIdStorage.getUserId()).subscribe(data => {
      this.stompClient.send('/app/send/sessionCard/' + this.sessionId, {}, this.selectedCard.id + ';' + data);
    });
    this.isMyTurn = true;
  }

  selectCard(sessionCard, i) {
    this.selectedCard = sessionCard;
    this.index = i;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Phase2Page');
  }

  private initializeWebSocketConnection(sessionId: number, userId: number, param3: this) {
    console.log('completed + sessionID: ' + this.sessionId );
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe('/cards/'+ sessionId, (cardid) => {
        if (cardid.body) {
          if (cardid.body.toString() === 'finished') {
            param3.stompEarlyFinish();
          } else {
            let selectedCardId = Number(cardid.body.toString().split(';')[0]);
            if (!(cardid.body.toString().split(';')[1] === '-11')) {
              const currentUserId = Number(cardid.body.toString().split(';')[1]);
              if (currentUserId === userId) {
                param3.increaseCardPriority(selectedCardId);
                param3.isMyTurn = true;
              }
              else {
                param3.increaseCardPriority(selectedCardId);
                param3.isMyTurn = false;
              }
            } else {
              param3.winningCards = [];
              param3.gameOver();

            }
          }
        }
      })
    })
  }

  increaseCardPriority(selectedCardId: number) {
    for (const card of this.sessionCards) {
      if (card.id === selectedCardId) {
        card.priority += 1;
        if (card.priority === this.maxProgres) {
          this.gameOver();
        }
      }
    }
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }

  private setCards() {
    let index = 0;

  }

  private gameOver() {
    let highestPriority =0;
    for (const card of this.sessionCards) {
      if (card.priority > highestPriority) {
        highestPriority = card.priority;
      }
    }
    for (const card of this.sessionCards) {
      if (card.priority === highestPriority) {
        this.winningCards.push(card);
        this.sessionService.endSession(this.sessionId, this.userId).subscribe();
        this.showPopup("Gewonnen","Winnende kaart is: " + card.name);
      }
    }
    this.sessionService.endSession(this.sessionId, this.userId).subscribe();
    this.gameIsFinished = true;
    this.navCtrl.setRoot("MenuPage");
  }

  public endSession() {

    this.sessionService.endSession(this.sessionId, this.userId).subscribe();
    this.stompClient.send('/app/send/sessionCard/' + this.sessionId, {}, 'finished');
  }

  public stompEarlyFinish() {
    let highestPriority = 0;
    for (const card of this.sessionCards) {
      if (card.priority > highestPriority) {
        highestPriority = card.priority;
      }
    }
    for (const card of this.sessionCards) {
      if (card.priority === highestPriority) {
        this.winningCards.push(card);
        this.showPopup("Vervroegd beëindigd","Winnende kaart is: " + card.name);
      }
    }
    this.earlyStop = true;
    this.gameIsFinished = true;
    this.navCtrl.setRoot("MenuPage");

  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.navCtrl.setRoot("MenuPage");
            }
          }
        }
      ]
    });
    alert.present();
  }
}
