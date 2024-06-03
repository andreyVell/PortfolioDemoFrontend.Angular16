import { Component, Inject, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Chat } from 'src/app/models/Chat/Chat';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { ClientViewChatService } from 'src/app/services/client-view-chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-view-chats-page',
  templateUrl: './client-view-chats-page.component.html',
  styleUrls: ['./client-view-chats-page.component.css']
})
export class ClientViewChatsPageComponent extends AdaptiveComponent implements OnDestroy {
  public ActiveChat: Chat | null = null;
  public selectedChatId: string | null | undefined = null;
  public IsMoreChatsLoading: boolean = false;
  private _subscriptions: Subscription[] = [];

  constructor(
    public clientViewChatService: ClientViewChatService,
    private dialog: MatDialog,
    private location: Location,
    private activateRoute: ActivatedRoute,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super();
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.selectedChatId = activateRoute.snapshot.params['chatId'];    
    if (this.selectedChatId) {
      if (this.clientViewChatService.chats && this.clientViewChatService.chats.length > 0) {
        this.OpenChatOnPageLoading(this.clientViewChatService.chats);
      }
      else {
        let sub = this.clientViewChatService.GetChats().subscribe((chats) => {
          this.OpenChatOnPageLoading(chats);
        });
        this._subscriptions.push(sub);
      }
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub)=> {
      sub.unsubscribe();
    })
  }

  public LoadMoreChats() {
    if (this.clientViewChatService.pageSettings.totalItems > this.clientViewChatService.chats.length && !this.IsMoreChatsLoading) {
      this.IsMoreChatsLoading = true;
      this.clientViewChatService.LoadMoreChats().subscribe({
        next: (isLoaded: boolean) => {
          if (isLoaded) {
            this.IsMoreChatsLoading = false;
          }
        },
        error: (error: any) => {
          this.IsMoreChatsLoading = false;
        }
      })
    }

  }

  public BackToChatsList() {
    this.selectedChatId = null;
    this.ActiveChat = null;
  }

  public ChatSelected(selectedChat: Chat | null) {
    if (this.ActiveChat != selectedChat) {
      this.selectedChatId = selectedChat?.id;
      this.ActiveChat = selectedChat;
    }
  }

  private OpenChatOnPageLoading(chats: Array<Chat>) {
    let selectedChat = chats.find(e => e.id == this.selectedChatId) ?? null;
    if (selectedChat) {
      this.ChatSelected(selectedChat);
    }
    else {
      if (!this.selectedChatId) return;
      this.clientViewChatService.GetChat(this.selectedChatId)
        .subscribe({
          next: (newChat: Chat) => {
            if (newChat.id) {
              this.ChatSelected(this.clientViewChatService.ReCreateNewChat(newChat))
            }
          }
        })
    }
  }
}
