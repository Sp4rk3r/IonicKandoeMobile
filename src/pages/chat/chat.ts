import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import * as $ from 'jquery';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs'
import {UserserviceProvider} from "../../providers/userservice/userservice";
import {UseridStorage} from "../../sessionStorage/userid-storage";
import {Message} from "../../model/message";
import {MessageServiceProvider} from "../../providers/message-service/message-service";
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [UseridStorage, UserserviceProvider],
  queries: {
    content: new ViewChild('content')
  }
})
export class ChatPage {
  private serverUrl = 'https://kandoe-backend.herokuapp.com/socket';
  private stompClient;
  public user = [];
  public username: string;
  public message = [new Message('')];
  public sessionId;
  private stringBody: string;
  private stringDiv: string;
  private timestamp: string;
  private timesubstring: string;

  constructor(private userservice: UserserviceProvider,
              private useridStorage: UseridStorage,
              private messageService: MessageServiceProvider,
              public navParams: NavParams) {
    this.userservice.getUser(this.useridStorage.getUserId()).subscribe(
      data => {
        this.user = data;
        console.log(data);
        console.log(this.user);
      }
    );
    this.messageService.getMessages(this.sessionId,this.useridStorage.getUserId()).subscribe(
      data => {
        this.message = data;
      }
    );
    this.username = useridStorage.getUsername();
    this.sessionId = this.navParams.get("sessionIdParam");
  }

  ngOnInit() {
    this.initializeWebSocketConnection(this.sessionId, this.username);
    this.messageService.getMessages(this.sessionId,this.useridStorage.getUserId()).subscribe(
      data => {
        this.message = data;
      }
    );
  }


  private initializeWebSocketConnection(sessionId: number, username: string) {
    let ws = new SockJS(this.serverUrl);
    this.stringBody= "";
    this.stringDiv = "";
    this.timestamp = "";
    this.timesubstring = "";
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/chat/" + sessionId , (message) => {
          this.stringBody = message.body;
          if (this.stringBody.includes(username)){
            $(".chat2").append("<div class='\messageContains\'>"+this.stringBody+"</div>");
          }else {
            $(".chat2").append("<div class='\notUserContains\' style='\position: relative; float: left; background: white; width: 60%; margin: 2vw; text-align: left; border-radius: 10px; padding: 5px\'>"+this.stringBody+"</div>");
          }
          console.log(message.body);
        }
      )
    })
  }

  sendMessage(message){
    let usernameMessage = this.useridStorage.getUsername() +': ' +  message ;
    let dbMessage = new Message( usernameMessage);
    this.messageService.sendMessage(dbMessage, this.sessionId, this.useridStorage.getUserId()).subscribe(data => { // ipv 2 naar sessionId
        console.log("message successfully send to database");
      },
      error => {
        console.error("Error sending message!");
        console.log(error);
      });
    this.stompClient.send('/app/send/message/' + this.sessionId , {}, usernameMessage); // ipv 2 -> sessionId
    $('#input').val('');
  }
}
