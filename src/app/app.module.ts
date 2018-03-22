import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import {HomePageModule} from "../pages/home/home.module";
import {SettingsPage} from "../pages/settings/settings";
import {LoginPage} from "../pages/login/login";
import {MenuPage} from "../pages/menu/menu";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {LoginPageModule} from "../pages/login/login.module";
import {MenuPageModule} from "../pages/menu/menu.module";
import {ChatPageModule} from "../pages/chat/chat.module";
import {ChatPage} from "../pages/chat/chat";
import {SessionDonePageModule} from "../pages/session-done/session-done.module";
import {SessionDonePage} from "../pages/session-done/session-done";
import { UserserviceProvider } from '../providers/userservice/userservice';
import {TokenStorage} from "../sessionStorage/token-storage";
import {Interceptor} from "./interceptor";
import {UseridStorage} from "../sessionStorage/userid-storage";
import {ActiveSessionPageModule} from "../pages/active-session/active-session.module";
import {ActiveSessionPage} from "../pages/active-session/active-session";
import { SessionsProvider } from '../providers/sessions/sessions';
import { MessageServiceProvider } from '../providers/message-service/message-service';
import {Phase1Page} from "../pages/phase1/phase1";
import {Phase1PageModule} from "../pages/phase1/phase1.module";
import {Phase2Page} from "../pages/phase2/phase2";
import {Phase2PageModule} from "../pages/phase2/phase2.module";
import { CardserviceProvider } from '../providers/cardservice/cardservice';
import {CreateCardPage} from "../pages/create-card/create-card";
import {CreateCardPageModule} from "../pages/create-card/create-card.module";

@NgModule({
  declarations: [
    MyApp,
    //HomePage
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    SettingsPageModule,
    LoginPageModule,
    MenuPageModule,
    ChatPageModule,
    SessionDonePageModule,
    HttpClientModule,
    ActiveSessionPageModule,
    Phase1PageModule,
    Phase2PageModule,
    CreateCardPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    LoginPage,
    MenuPage,
    ChatPage,
    SessionDonePage,
    ActiveSessionPage,
    Phase1Page,
    Phase2Page,
    CreateCardPage,
  ],
  providers: [
    TokenStorage,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    HttpClientModule,
    UserserviceProvider,
    Interceptor,
    UseridStorage,
    AuthServiceProvider,
    UserserviceProvider,
    SessionsProvider,
    MessageServiceProvider,
    CardserviceProvider,
  ],
})
export class AppModule {}
