import { Component, OnInit } from '@angular/core';
import { AccessService } from './services/access.service';
import { ChatService } from './services/chat.service';
import { CurrentUserDataService } from './services/current-user-data.service';
import { ClientViewChatService } from './services/client-view-chat.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FormatHelper } from './helpers/FormatHelper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private accessService: AccessService,
    private chatService: ChatService,
    private clientViewChatService: ClientViewChatService,
    private currentUserDataService: CurrentUserDataService,
    private imageCompressService: NgxImageCompressService) {
  }

  public ngOnInit(): void {
    FormatHelper.Initialize(this.imageCompressService);
    if (this.currentUserDataService.IsCurrentUserIsUser()) {
      this.currentUserDataService.initializeCurrentUserData();
      this.accessService.PopulateAccessesForCurrentUserObservable()
        .subscribe({
          next: (response: boolean) => {
            if (response) {
              if (this.accessService.HasReadAccessTo('Chat')) {
                this.chatService.InitializeChats();
              }
            }
          },
          error: () => {

          }
        });
    }

    if (this.currentUserDataService.IsCurrentUserIsClient()) {
      this.clientViewChatService.InitializeChats();
    }
  }
}
