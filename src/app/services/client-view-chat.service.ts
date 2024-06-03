import { Injectable } from '@angular/core';
import { ComponentWithPagination } from '../models/_Pagging/ComponentWithPagination';
import { Chat } from '../models/Chat/Chat';
import { PageSettings } from '../models/_Pagging/PageSetting';
import { map, Observable, Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';
import { AttachFileModel } from '../models/_ApiBase/AttachFileModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CurrentUserDataService } from './current-user-data.service';
import { EmployeesService } from './employees.service';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { ChatMessage } from '../models/Chat/ChatMessage';
import { ChatMessageViewedInfo } from '../models/Chat/ChatMessageViewedInfo';
import { ItemsCollectionResponce } from '../models/_ApiBase/ItemsCollectionResponce';
import { ChatMember } from '../models/Chat/ChatMember';
import { ApiResponseSuccessfullCreate } from '../models/_ApiBase/ApiResponseSuccessfullCreate';
import { FormatHelper } from '../helpers/FormatHelper';
import { ChatMessageAttachedFile } from '../models/Chat/ChatMessageAttachedFile';

@Injectable({
  providedIn: 'root'
})
export class ClientViewChatService implements ComponentWithPagination {
  public chats: Array<Chat> = [];
  public pageSettings: PageSettings = new PageSettings(this, true);
  private currentUserClientId: string;
  private chatsSubject: Subject<Array<Chat>> = new Subject<Array<Chat>>();
  private chatsHubConnection!: HubConnection;
  private chatsHubConnectionId: string | null = null;
  private maxMessageTextLength: number = 2000;

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private currentUserDataService: CurrentUserDataService,
    private employeesService: EmployeesService,
  ) {
    this.currentUserClientId = currentUserDataService.GetCurrentUserId();
  }

  public InitializeChats() {
    this.currentUserClientId = this.currentUserDataService.GetCurrentUserId();
    this.pageSettings.ApplyFilter();
    this.InitializeSignalRConnection();
  }

  public DeInitializeChats() {
    this.currentUserClientId = '';
    this.DeInitializeSignalRConnection();
  }

  public Refresh() {
    this.GetChatsPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Chat>) => {
          this.chats = response.items
            .map(chat => new Chat(this.currentUserClientId, chat));
          this.chatsSubject.next(this.chats);
          this.pageSettings.totalItems = response.totalItems;
          this.PopulateChatAndChatMembersAvatars(this.chats);
        }
      });
  }

  public LoadMoreChats(): Observable<boolean> {
    this.pageSettings.curentPage++;
    return this.GetChatsPage(this.pageSettings)
      .pipe(
        map((response: ItemsCollectionResponce<Chat>) => {
          let newChats = response.items
            .map(chat => new Chat(this.currentUserClientId, chat));
          this.PopulateChatAndChatMembersAvatars(newChats);
          this.chats = this.chats.concat(newChats);
          this.pageSettings.totalItems = response.totalItems;

          return true;
        })
      );
  }

  public LoadMoreMessages(chat: Chat, startIndex: number, itemsPerPage: number): Observable<ItemsCollectionResponce<ChatMessage>> {
    return this.httpClient.get<ItemsCollectionResponce<ChatMessage>>
      (BackendApiEndpoints.get_client_view_more_messages_for_chat_endpoint, {
        params: {
          chatId: chat.id,
          startIndex: startIndex,
          itemsPerPage: itemsPerPage
        }
      });
  }

  public GetChats(): Observable<Array<Chat>> {
    return this.chatsSubject.asObservable();
  }

  public SendMessage(startPart: number, chat: Chat) {
    let message = new ChatMessage();
    let messageText = chat.textForNewMessage.trim();
    if (((startPart + 1) * this.maxMessageTextLength) - 1 > messageText.length) {
      message.text = messageText.substring(startPart * this.maxMessageTextLength);
      chat.textForNewMessage = '';
      
      chat.selectedFilesForNewMessage.forEach(af => {
        let newAttachedFile = new ChatMessageAttachedFile(undefined, af)
        newAttachedFile.mediumImage = newAttachedFile.fileContent;
        newAttachedFile.fileName = newAttachedFile.fileContent.fileName;
        message.attachedFiles.push(newAttachedFile);
      })
      chat.selectedFilesForNewMessage = [];
    }
    else {
      message.text = messageText.substring(startPart * this.maxMessageTextLength, (startPart + 1) * this.maxMessageTextLength);
    }
    message.ownerId = chat.GetYourself()?.id ?? '';
    message.chatId = chat.id;
    message.createdOn = new Date();
    let addedMessage = chat.AddNewMessage(message);
    this.PostMessageToBackend(message)
      .subscribe({
        next: (val: ApiResponseSuccessfullCreate) => {
          if (val.id) {
            this.PopulateChatMessageInfoFromApiResponse(addedMessage, val);
            if (messageText.length > (startPart + 1) * this.maxMessageTextLength) {
              this.SendMessage(startPart + 1, chat);
            }
            else {              
              this.OrderChatsByLastMessageDate();
            }
          }
        },
        error: (err: any) => {
          addedMessage.isNotSended = true;
        }
      })

  }

  public ReSendMessage(chatMessage: ChatMessage) {
    const chatMessageWithoutUnnecessaryInformation = new ChatMessage(chatMessage);
    chatMessageWithoutUnnecessaryInformation.nextGroupMessage = null;
    chatMessageWithoutUnnecessaryInformation.previousGroupMessage = null;
    chatMessageWithoutUnnecessaryInformation.viewedInfos = [];
    this.PostMessageToBackend(chatMessageWithoutUnnecessaryInformation)
      .subscribe({
        next: (val: ApiResponseSuccessfullCreate) => {
          if (val.id) {
            this.PopulateChatMessageInfoFromApiResponse(chatMessage, val);
            this.OrderChatsByLastMessageDate();
          }
        },
        error: (err: any) => {
          chatMessage.isNotSended = true;
        }
      });
  }

  public ReadMessage(message: ChatMessage, chat: Chat | null): void {
    if (!chat) return;
    message.isReading = true;
    const yourselfId = chat.GetYourself()?.id;
    if (!yourselfId) return;
    this.PostMessageViewedInfoToBackend(message.id, yourselfId)
      .subscribe({
        next: (response: ChatMessageViewedInfo) => {
          message.viewedInfos.push(new ChatMessageViewedInfo(response));
          message.isReading = false;
        },
        error: (error: any) => {
          message.isReading = false;
        }
      });
  }

  public GetCountOfUnviewedChats(): number | null {
    let count = 0;
    this.chats.forEach(chat => {
      if (chat.GetCountOfLastUnviewedMessages()) {
        count++;
      }
    });
    if (count == 0) return null;
    return count;
  }

  public ReCreateNewChat(chat: Chat | null | undefined): Chat | null {
    if (!chat) return null;
    let newChat = new Chat(this.currentUserClientId, chat)
    this.PopulateChatAndChatMembersAvatars([newChat]);
    return newChat;
  }

  public PopulateImageMediumContent(image: ChatMessageAttachedFile) {
    image.fileContent.isFileContentProcessing = true;
    this.GetChatMessageAttachedFileContent(image.id, true)
      .subscribe({
        next: (response: AttachFileModel) => {
          image.mediumImage = new AttachFileModel(response);
          image.fileContent.isFileContentProcessing = false;
        }
      })
  }

  public PopulateFullFileContent(image: ChatMessageAttachedFile) {
    image.fileContent.isFileContentProcessing = true;
    this.GetChatMessageAttachedFileContent(image.id, false)
      .subscribe({
        next: (response: AttachFileModel) => {
          image.fileContent = new AttachFileModel(response);
          image.fileContent.isFileContentProcessing = false;
        }
      })
  }

  public PopulateFullFileContentObservable(image: ChatMessageAttachedFile): Observable<AttachFileModel> {
    return this.GetChatMessageAttachedFileContent(image.id, false);
  }

  public GetChat(chatId: string): Observable<any> {
    return this.httpClient.get<Chat>(
      BackendApiEndpoints.get_client_view_chat_endpoint + `/${chatId}`
    );
  }

  private InitializeSignalRConnection() {
    this.chatsHubConnection = new HubConnectionBuilder()
      .withUrl(BackendApiEndpoints.chats_hub_endpoint,
        { accessTokenFactory: () => this.currentUserDataService.getAuthTokenFromLocalStorage() ?? '' })
      .build();

    this.ConnectToSignalR();

    this.chatsHubConnection.onclose(() => {
      if (this.chatsHubConnectionId) {
        this.ReConnectToSignalR();
      }
    });

    this.chatsHubConnection.on('NewMessageCreated', (newMessage: ChatMessage) => {
      if (newMessage) {
        this.ProcessNewIncomingMessage(newMessage);
      }
    });

    this.chatsHubConnection.on('NewChatCreated', (newChat: Chat) => {
      if (newChat) {
        this.ProcessNewIncomingChat(newChat);
      }
    });

    this.chatsHubConnection.on('NewMessageViewedInfoCreated', (newInfo: ChatMessageViewedInfo, chatId: string) => {
      if (newInfo) {
        this.ProcessNewIncomingMessageViewedInfo(chatId, newInfo);
      }
    });

    this.chatsHubConnection.on('ChatNameUpdated', (chatId: string, newChatName: string) => {
      this.ProcessChatNameChanged(chatId, newChatName);
    });

    this.chatsHubConnection.on('ChatAvatarUpdated', (chatId: string, newAvatar: AttachFileModel) => {
      this.ProcessChatAvatarChanged(chatId, newAvatar);
    });

    this.chatsHubConnection.on('ChatMemberDeleted', (chatId: string, chatMemeberId: string) => {
      this.ProcessChatMemberDeleted(chatId, chatMemeberId);
    });
  }

  private DeInitializeSignalRConnection() {
    this.chatsHubConnection?.stop()
      .then(async () => {
        this.chatsHubConnectionId = null;
      })
      .catch(err => {
        console.log("Ошибка при закрытии соединения с сервером чатов");
      });;
  }

  private ConnectToSignalR() {
    this.chatsHubConnection.start()
      .then(async () => {
        this.chatsHubConnectionId = await this.chatsHubConnection.invoke<string>('GetConnectionId');
      })
      .catch(err => {
        this.ReConnectToSignalR();
      });
  }

  private ReConnectToSignalR() {
    setTimeout(() => {
      this.ConnectToSignalR();
    }, 7000);
  }

  private ProcessNewIncomingMessage(newMessage: ChatMessage) {
    let chat = this.chats.find(e => e.id == newMessage.chatId);
    if (chat) {
      chat.AddNewMessage(newMessage);
      this.OrderChatsByLastMessageDate();
    }
    else {
      //может быть ситуация что давний чат не загружен прямо сейчас и поэтому его нужно загрузить дополнительно
      this.GetChat(newMessage.chatId)
        .subscribe({
          next: (newChat: Chat) => {
            if (newChat.id) {
              newChat = new Chat(this.currentUserClientId, newChat);
              this.chats.unshift(newChat);
              this.OrderChatsByLastMessageDate();
              if (this.chats.length >= this.pageSettings.itemsPerPage) {
                this.chats.pop();
              }
              this.PopulateChatAndChatMembersAvatars([newChat]);
            }
          }
        })
    }
  }

  private ProcessNewIncomingChat(newChat: Chat): void {
    if (newChat.id) {
      newChat = new Chat(this.currentUserClientId, newChat);
      this.chats.unshift(newChat);
      this.PopulateChatAndChatMembersAvatars([newChat]);
    }
  }

  private ProcessNewIncomingMessageViewedInfo(chatId: string, info: ChatMessageViewedInfo): void {
    if (!info || !chatId) return;
    let chat = this.chats.find(e => e.id == chatId);
    if (chat) {
      let message = chat.messages.find(e => e.id == info.messageId);
      if (message) {
        message.viewedInfos.push(new ChatMessageViewedInfo(info));
      }
      if (message?.id == chat.lastMessage?.id) {
        chat.lastMessage?.viewedInfos.push(new ChatMessageViewedInfo(info));
      }
    }
  }

  private ProcessChatNameChanged(chatId: string, newChatName: string) {
    if (chatId && newChatName) {
      let chat = this.chats.find(e => e.id == chatId);
      if (chat) {
        chat.name = newChatName;
      }
    }
  }

  private ProcessChatAvatarChanged(chatId: string, newChatAvatar: AttachFileModel) {
    if (chatId && newChatAvatar) {
      let chat = this.chats.find(e => e.id == chatId);
      if (chat) {
        newChatAvatar = new AttachFileModel(newChatAvatar);
        chat.SetChatAvatar(newChatAvatar);
        chat.SetChatBigAvatar(newChatAvatar);
      }
    }
  }

  private ProcessChatMemberDeleted(chatId: string, chatMemeberId: string) {
    if (chatId && chatMemeberId) {
      let chat = this.chats.find(e => e.id == chatId);
      if (chat) {
        if (chatMemeberId == chat.GetYourself()?.id) {
          this.chats = this.chats.filter(e => e != chat);
          const currentChatId = window.location.href.substring(+window.location.href.lastIndexOf('Chats/') + 6);
          if (currentChatId == chat.id) {
            this.router.navigate(['Chats']);
          }
        }
        else {
          chat.DeleteChatMember(chatMemeberId);
        }
      }
    }
  }

  private GetChatsPage(pageSettings: PageSettings): Observable<ItemsCollectionResponce<Chat>> {
    return this.httpClient.get<ItemsCollectionResponce<Chat>>
      (BackendApiEndpoints.get_client_view_chats_page_endpoint, {
        params: {
          startIndex: pageSettings.curentPage * pageSettings.itemsPerPage,
          itemsPerPage: pageSettings.itemsPerPage,
          filterString: pageSettings.currentFilterString
        }
      });
  }

  private PopulateChatAndChatMembersAvatars(chats: Array<Chat>) {
    chats.forEach((chat: Chat) => {
      if (chat.isGroupChat) {
        this.GetChatSmallAvatar(chat.id)
          .subscribe({
            next: (response: AttachFileModel) => {
              chat.SetChatAvatar(response);
            }
          })
      }
      let yourself = chat.GetYourself();
      // this.SetAnAvatarForYourselfInTheChat(chat);
      chat.chatMembers
        .filter(e => !e.avatar && e.id != yourself?.id)
        .forEach((chatMember: ChatMember) => {
          this.GetChatMemberSmallAvatar(chatMember.id)
            .subscribe({
              next: (response: AttachFileModel) => {
                chatMember.avatar = response;
              }
            })
        })

    })
  }

  private GetChatSmallAvatar(chatId: string): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_client_view_chat_small_avatar_endpoint(chatId)
    );
  }

  private GetChatMemberSmallAvatar(chatMemberId: string): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_client_view_chat_member_small_avatar_endpoint(chatMemberId)
    );
  }

  private PostMessageToBackend(newMessage: ChatMessage): Observable<ApiResponseSuccessfullCreate> {
    let body = this.SpecifyDateFormat(newMessage);
    return this.httpClient.post<ApiResponseSuccessfullCreate>(
      BackendApiEndpoints.create_client_view_chat_message_endpoint,
      body, {
      params: {
        eventOriginConnectionId: this.chatsHubConnectionId ?? ''
      }
    }
    );
  }

  private OrderChatsByLastMessageDate(): void {
    this.chats = this.chats.sort((a, b) => {
      if ((a.lastMessage?.createdOn.getTime() ?? 0) < (b.lastMessage?.createdOn.getTime() ?? 0))
        return 1;
      if ((b.lastMessage?.createdOn.getTime() ?? 0) < (a.lastMessage?.createdOn.getTime() ?? 0))
        return -1;
      return 0;
    });
  }

  private SpecifyDateFormat(model: Chat | ChatMessage) {
    const newModel = Object.create({});
    Object.assign(newModel, model);
    for (let prop in newModel) {
      let value = newModel[prop];
      if (value instanceof Date) {
        if (newModel[prop].getHours() === 0 && newModel[prop].getMinutes() === 0 && newModel[prop].getSeconds() === 0 && newModel[prop].getMilliseconds() === 0) {
          newModel[prop] = FormatHelper.DateToISOFormatString(newModel[prop]);
        }
        else {
          newModel[prop] = newModel[prop].toISOString();
        }
      }
    }
    return newModel;
  }

  private PostMessageViewedInfoToBackend(messageId: string, yourselfId: string): Observable<ChatMessageViewedInfo> {
    return this.httpClient.post<ChatMessageViewedInfo>(
      BackendApiEndpoints.client_view_view_chat_message_endpoint(messageId, yourselfId),
      null, {
      params: {
        eventOriginConnectionId: this.chatsHubConnectionId ?? ''
      }
    }
    )
  }

  private GetChatMessageAttachedFileContent(chatMessageAttachedFileId: string, isImageMedium: boolean = false): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_client_view_chat_message_attached_file_content_endpoint(chatMessageAttachedFileId), {
      params: {
        isImageMedium: isImageMedium
      }
    }
    );
  }

  private PopulateChatMessageInfoFromApiResponse(chatMessage: ChatMessage, apiResponse: ApiResponseSuccessfullCreate) {
    //TODOsecondary при создании сообщения с прикреплёнными файлами, у ChatMessageAttachedFile не заполняются EntityBase свойства   
    chatMessage.id = apiResponse.id;
    chatMessage.createdByUser = apiResponse.createdByUser;
    chatMessage.createdOn = new Date(apiResponse.createdOn);
    chatMessage.updatedByUser = apiResponse.updatedByUser;
    chatMessage.updatedOn = apiResponse.updatedOn;
    chatMessage.isNotSended = false;
  }
}
