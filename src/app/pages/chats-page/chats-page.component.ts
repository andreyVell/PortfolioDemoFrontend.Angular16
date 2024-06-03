import { Component, Inject, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Chat } from 'src/app/models/Chat/Chat';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatCreatorComponent } from 'src/app/components/chat/chat-creator/chat-creator.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrls: ['./chats-page.component.css']
})
export class ChatsPageComponent extends ComponentWithAccessSegregation implements OnDestroy {
  public ActiveChat: Chat | null = null;
  public selectedChatId: string | null | undefined = null;
  public IsMoreChatsLoading: boolean = false;
  private _subscriptions: Subscription[] = [];

  constructor(
    public chatService: ChatService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,

    private location: Location,
    private activateRoute: ActivatedRoute,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);    
    this.selectedChatId = activateRoute.snapshot.params['chatId'];
    if (this.selectedChatId) {
      if (this.chatService.chats && this.chatService.chats.length > 0) {
        this.OpenChatOnPageLoading(this.chatService.chats);
      }
      else {
        let sub = this.chatService.GetChats().subscribe((chats) => {
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
    if (this.chatService.pageSettings.totalItems > this.chatService.chats.length && !this.IsMoreChatsLoading) {
      this.IsMoreChatsLoading = true;
      this.chatService.LoadMoreChats().subscribe({
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

  public ChatSelected(selectedChat: Chat | null) {
    if (this.ActiveChat != selectedChat) {
      this.selectedChatId = selectedChat?.id;
      this.ActiveChat = selectedChat;
    }
  }

  public OpenChatCreator() {
    const dialogFormRef = this.dialog.open(ChatCreatorComponent, {
      data: this,
    });
  }

  public OpenNewPersonalChat(chat: Chat) {
    this.selectedChatId = 'new Chat';
    this.ActiveChat = chat;    
    this.location.replaceState('Chats');
  }

  public BackToChatsList() {
    this.selectedChatId = null;
    this.ActiveChat = null;
  }

  private OpenChatOnPageLoading(chats: Array<Chat>) {
    let selectedChat = chats.find(e => e.id == this.selectedChatId) ?? null;
    if (selectedChat) {
      this.ChatSelected(selectedChat);
    }
    else {
      if (!this.selectedChatId) return;
      this.chatService.Get(this.selectedChatId)
        .subscribe({
          next: (newChat: Chat) => {
            if (newChat.id) {
              this.ChatSelected(this.chatService.ReCreateNewChat(newChat))
            }
          }
        })
    }
  }
}
