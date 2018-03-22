import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import {MessageServiceProvider} from "../../providers/message-service/message-service";


@NgModule({
  declarations: [
    ChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
  ],
  exports: [
  ],
  providers:[
    MessageServiceProvider
  ]
})
export class ChatPageModule {}
