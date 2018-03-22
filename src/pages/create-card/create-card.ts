import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Card} from "../../model/card";
import {CardserviceProvider} from "../../providers/cardservice/cardservice";
import {SessionsProvider} from "../../providers/sessions/sessions";
import {UseridStorage} from "../../sessionStorage/userid-storage";
import {Session} from "../../model/session";
import {Phase1Page} from "../phase1/phase1";

/**
 * Generated class for the CreateCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-card',
  templateUrl: 'create-card.html',
})
export class CreateCardPage {
  //public card = new Card(0, 0, '', '', '');
  public card: Card = {
    'id': 0,
    'categoryId': 0,
    'name': '',
    'description': '',
    'image': '',
  };
  public editing = 0;
  public cards = [];
  public correctName = true;
  public check = false;
  public sessionId;
  public userId;
  public session = new Session(0, '', 0, 0, 0, 0, 0, [''], [''], [], [], 0, [], null, false, new Date(), false, 0,  0);
  public cardName;
  public cardDesc;
  public addCard;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public cardService: CardserviceProvider,
              public sessionService: SessionsProvider,
              public userIdStorage: UseridStorage) {
    this.userId = this.userIdStorage.getUserId();
    this.sessionId = this.navParams.get("sessionIdParam");

    this.sessionService.getSession(this.sessionId, this.userId).subscribe(
      data => {
        this.session = data;
      },
      error => {
        alert("Error loading session")
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCardPage');
  }

  createCard(card: Card) {
    this.editing = 0;
    console.log("kaartnaam functie: " + card.name);
    this.navCtrl.setRoot('Phase1Page', {
      sessionId: this.sessionId,
      addCard: true,
      kaartnaam: card.name,
      kaartdesc: card.description,
    });
  }



  checkName() {
    for (const card of this.cards) {
      if (card.name === this.card.name) {
        this.correctName = false;
        this.check = true;
      }
    }
    if (!this.check) {
      this.correctName = true;
    }
    this.check = false;
  }

}
