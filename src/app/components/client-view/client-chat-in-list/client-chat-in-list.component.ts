import { Component, Input } from '@angular/core';
import { Chat } from 'src/app/models/Chat/Chat';

@Component({
  selector: 'app-client-chat-in-list',
  templateUrl: './client-chat-in-list.component.html',
  styleUrls: ['./client-chat-in-list.component.css']
})
export class ClientChatInListComponent {
  @Input() chat: Chat | null = null;
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';
}
