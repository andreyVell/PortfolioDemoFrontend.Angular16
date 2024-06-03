import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { EntityAttachedFile } from 'src/app/models/_ApiBase/EntityAttachedFile';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { WrapperForValueType } from 'src/app/models/_ApiBase/WrapperForValueType';
import { Chat } from 'src/app/models/Chat/Chat';
import { ChatMessage } from 'src/app/models/Chat/ChatMessage';
import { ChatMessageAttachedFile } from 'src/app/models/Chat/ChatMessageAttachedFile';
import { ClientViewChatService } from 'src/app/services/client-view-chat.service';

@Component({
  selector: 'app-client-active-chat',
  templateUrl: './client-active-chat.component.html',
  styleUrls: ['./client-active-chat.component.css']
})
export class ClientActiveChatComponent extends AdaptiveComponent {
  @Input('activeChat')
  get activeChat(): Chat | null {
    return this._activeChat;
  }
  set activeChat(newChat: Chat | null) {
    this.SaveChatScrollSettings();
    this._activeChat = newChat;
    setTimeout(() => {
      this._messageInput?.nativeElement?.focus();
    }, 1);
  }  
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';
  public inputMessagePlaceholder: string = 'Напишите сообщение...';
  public isFilesProcessing: WrapperForValueType<boolean> = new WrapperForValueType(false);
  public isChatCreating: boolean = false;
  private isMoreMessagesLoading: boolean = false;
  private _activeChat: Chat | null = null;
  @Output() backToChatsListPressed: EventEmitter<void> = new EventEmitter();
  @ViewChild('scrollableMessagesContainer') private _scrollableDiv!: ElementRef;
  @ViewChild('messageInput') private _messageInput!: ElementRef;

  constructor(
    public clientViewChatService: ClientViewChatService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    super();

    //TODOsecondary показывать chatDetails в каком-то формате
    //TODOsecondary показывать что печатаешь сообщение    
    //TODO Скролл не работает на телефоне, на копе тоже через раз
    //TODO неудобно сворачивается клавиатура после отправки отправке сообщения (на мобиле)
    //TODO когда загружаются новые сообщения скролл улетает в низ
    //TODO когда новый чат создаёшь то он не всегда открывается
  }

  public keydownEnter(event: Event){
    if (this.IsSmallScreen()){

    }
    else{
      event.preventDefault(); 
      this.SendMessage();
    }
  }

  public SendMessage() {  
    this._messageInput?.nativeElement?.focus();  
    if ((!this._activeChat?.textForNewMessage || this._activeChat?.textForNewMessage.trim() === '')
      && ((this._activeChat?.selectedFilesForNewMessage.length ?? 0) == 0)) return;
    this.setScrollChatPosition(0);
    this._activeChat?.HideNewMessageLabel();
    if (this._activeChat?.id) {
      this.clientViewChatService.SendMessage(0, this._activeChat);
    }
  }

  public LoadMoreMessages(): void {    
    if (!this._activeChat) return;
    if (this._activeChat.messages.length < this._activeChat.totalMessagesCount && !this.isMoreMessagesLoading) {
      this.isMoreMessagesLoading = true;
      this.clientViewChatService.LoadMoreMessages(this._activeChat, this._activeChat.messages.length, 60)
        .subscribe({
          next: (response: ItemsCollectionResponce<ChatMessage>) => {
            response.items.forEach((cm: ChatMessage) => this._activeChat?.AddNewMessageAtEnd(cm));
            this.isMoreMessagesLoading = false;
          },
          error: (error: any) => {
            this.isMoreMessagesLoading = false;
          }
        });
    }
  }

  public ReSendMessage(message: ChatMessage): void {
    message.isNotSended = false;
    this.clientViewChatService.ReSendMessage(message);
  }

  public BackToChats(){
    this.SaveChatScrollSettings();
    this.backToChatsListPressed.emit();
    this.router.navigate(['ClientView/Chats']);
  }

  public MessageInView(message: ChatMessage): void {
    if (!this._activeChat?.IsThisMessageYours(message)
      && !this._activeChat?.IsMessageViewedByYou(message)
      && !message.isReading) {
      this.clientViewChatService.ReadMessage(message, this._activeChat);
    }
  }

  public ProcessInputFiles(filesInput: HTMLInputElement) {
    let processedFiles = FormatHelper.ProcessFilesFromInput(filesInput, this.isFilesProcessing, this.snackBar);
    processedFiles.forEach(file => {
      this._activeChat?.selectedFilesForNewMessage.unshift(file);
    })
    filesInput.value = '';
  }

  public DeleteFile(file: AttachFileModel) {
    this._activeChat?.DeleteFile(file);
  }

  public GetImageMediumContent(image: EntityAttachedFile) {
    this.clientViewChatService.PopulateImageMediumContent(image as ChatMessageAttachedFile);
  }

  public GetImageFullContent(image: EntityAttachedFile) {
    this.clientViewChatService.PopulateFullFileContent(image as ChatMessageAttachedFile);
  }

  public DownloadFileContent(file: EntityAttachedFile) {
    file.isFileDownloading = true;    
    if (file.fileContent?.fileContent) {      
      this.SaveFileOnDisk(file.fileContent);
      file.isFileDownloading = false;
    }
    else {
      this.clientViewChatService.PopulateFullFileContentObservable(file as ChatMessageAttachedFile)
        .subscribe({
          next: (val: AttachFileModel) => {
            if (val && val.fileContent) {
              file.fileContent = new AttachFileModel(val);
              this.SaveFileOnDisk(file.fileContent);
              file.isFileDownloading = false;
            }
          }
        });
    }
  }

  public MessageRendered(message: ChatMessage | null) {
    if (message == this.activeChat?.messages[this.activeChat?.messages.length - 1]) {
      //TODOsecondary не гарантирует что все сообщения были отрендерены
      this.setScrollPositionAfterViewRendered();
    }
  }

  private SaveChatScrollSettings() {
    this._activeChat?.HideNewMessageLabel();
    this.saveScrollChatPosition();
  }

  private SaveFileOnDisk(val: AttachFileModel) {
    if (val.fileContent) {
      let link = document.createElement('a');
      link.href = val.fileContent;
      link.download = val.fileName ?? "";
      link.click();
    }
  } 

  private setScrollPositionAfterViewRendered() {
    if (this._activeChat?.scrollPostion) {
      // console.log("setScrollChatPosition");
      // console.log(this._activeChat?.scrollPostion);
      this.setScrollChatPosition(this._activeChat.scrollPostion);
    }
    else {
      if (this._activeChat?.lastUnviewedMessage != (null || undefined)) {
        // console.log("scrollToMessage");
        this.scrollToMessage(this._activeChat.lastUnviewedMessage);
      }
      else {
        // console.log("setScrollChatPosition0");
        this.setScrollChatPosition(0);
      }
    }

  }

  private scrollToMessage(message: ChatMessage): void {
    //TODOsecondary не всегда работает, очень странно даже работает, возможно использовать таймаут
    let messageEl = document.getElementById(message.id);
    messageEl?.scrollIntoView();
  }

  private setScrollChatPosition(position: number) {
    //TODOsecondary не всегда работает, очень странно даже работает, возможно использовать таймаут
    // setTimeout(() => {
    if (this._scrollableDiv?.nativeElement?.scrollTop != undefined) {
      this._scrollableDiv.nativeElement.scrollTop = position;
    }
    // }, 0);
  }

  private saveScrollChatPosition() {
    if (this._scrollableDiv?.nativeElement?.scrollTop != undefined && this._activeChat) {
      this._activeChat.scrollPostion = this._scrollableDiv.nativeElement.scrollTop;
    }
  }
}
