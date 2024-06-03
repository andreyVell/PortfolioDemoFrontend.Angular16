import { Component, Input } from '@angular/core';
import { Chat } from 'src/app/models/Chat/Chat';

@Component({
  selector: 'app-chat-in-list',
  templateUrl: './chat-in-list.component.html',
  styleUrls: ['./chat-in-list.component.css']
})
export class ChatInListComponent {
  @Input() chat: Chat | null = null;
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';
}
