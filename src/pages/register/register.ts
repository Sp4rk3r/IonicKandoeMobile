import { Component } from '@angular/core';
import {IonicPage, NavController, AlertController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {LoginPage} from "../login/login";
import {User} from "../../model/user";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { email: '', password: '', firstname: '', lastname: '', username: '' };
  model = new User(0,'', '', '', '', '');

  constructor(public nav: NavController,  private auth: AuthServiceProvider, private alertCtrl: AlertController) {
  }

  public register2() {
    this.auth.register2(this.model).subscribe(
      data => {
        console.log("User succesfully registered!");
        this.nav.setRoot(LoginPage);
        this.showPopup("Succesfully registerd", this.model.firstname);
      },
      error => {
        this.showPopup("Unable to register User", "please try again");
      }
    )
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
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  goBackToLogin() {
    this.nav.setRoot('LoginPage');
  }
}
