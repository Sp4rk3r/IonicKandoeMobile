import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {Session} from "../../model/session";
import {SessionsProvider} from "../../providers/sessions/sessions";
import {UseridStorage} from "../../sessionStorage/userid-storage";
import {CardserviceProvider} from "../../providers/cardservice/cardservice";
import {MenuPage} from "../menu/menu";
import {ChatPage} from "../chat/chat";
import {CreateCardPage} from "../create-card/create-card";
import {Card} from "../../model/card";
import {LoginPage} from "../login/login";
import {AuthServiceProvider} from "../../providers/auth-service/auth-service";
import {SessionCard} from "../../model/sessionCard";

/**
 * Generated class for the Phase1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phase1',
  templateUrl: 'phase1.html',
})
export class Phase1Page {

  public userId;
  public sessionId;
  public session = new Session(0, '', 0, 0, 0, 0, 0, [''], [''], [], [], 0, [], null, false, new Date(), false, 0,  0);
  public cards = [];
  public cards2 = [];
  public selectedCards = [];
  public buttonStates = [];
  public cardName;
  public cardDesc;
  public set = 0;
  public card;
  public edit = false;
  public cardNew;
  public id = 0;

  public barValue: 40;
  public turn = true;
  public sessionIdParam;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private sessionService: SessionsProvider,
              private userIdStorage: UseridStorage,
              private cardService: CardserviceProvider,
              private popoverCtrl: PopoverController,
              private auth: AuthServiceProvider) {
    this.userId = this.userIdStorage.getUserId();
    this.sessionId = this.navParams.get("sessionId");

    console.log("Naam kaart functie return: " + this.navParams.get("kaartnaam"));
    console.log("Desc retun functie: " + this.navParams.get("kaartdesc"));
    this.cardName = this.navParams.get("kaartnaam");
    this.cardDesc = this.navParams.get("kaartdesc");

    this.card = new Card(0,this.session.categoryId,this.cardName, this.cardDesc,'');
    this.cards2.push(this.card);
    console.log('card: ' + this.card);
    console.log('cardnaam: ' + this.card.name);
    console.log('cardDesc' + this.card.description);

    this.sessionService.getSession(this.sessionId,this.userId).subscribe(
      data => {
        this.session = data;
      },
      error => {
        alert("Error loading session");
      }, () => {
        this.cardService.getCardsByCategory(this.session.categoryId, this.session.themeId, this.userId).subscribe(
          data => {
            this.cards = data;
            this.cardNew = new Card(0,this.session.categoryId,this.cardName,this.cardDesc,'');
            this.cards.push(this.cardNew);
            console.log("id: " + this.cardNew.id);
          },
          error => {
            alert("Error loading cards");
          }, () => {
            this.fillButtonStates();
          }
        )
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Phase1Page');
  }

  private fillButtonStates() {
    for (const card of this.cards) {
      this.buttonStates.push(false);
    }
  }

  selectCard(card, index) {
    this.selectedCards.push(card);
    this.buttonStates[index] = true;
  }

  deselectCard(card, index) {
    let cardIndex = this.selectedCards.indexOf(card);
    if (cardIndex > -1) {
      this.selectedCards.splice(cardIndex, 1);
    }
    this.buttonStates[index] = false;
  }

  saveCards() {
    console.log(this.selectedCards);
    this.sessionService.saveSessionCards(this.selectedCards, this.session.id, this.userId).subscribe(
      data => {
        console.log('selectedcard ' + this.selectedCards.toString());
        console.log('sessioncards ' + data.sessionCardDtos[0]);
        this.navCtrl.setRoot('MenuPage');
      }
    )
  }

  saveCardsIds() {
    this.sessionService.saveSessionCards(this.selectedCards, this.session.id, this.userId).subscribe(
      data => {
        this.navCtrl.setRoot(MenuPage);
      }
    )
  }
  openMondal(sessionId: number) {
    this.navCtrl.push(ChatPage, {
      sessionIdParam : sessionId,
    });
  }

  createCard(sessionId: number) {
      this.navCtrl.push(CreateCardPage, {
        sessionIdParam: sessionId,
      });
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage)
    });
  }
}
