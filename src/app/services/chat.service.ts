import { Injectable, OnDestroy } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { Chat } from '../models/Chat/Chat';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponseSuccessfullCreate } from '../models/_ApiBase/ApiResponseSuccessfullCreate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageSettings } from '../models/_Pagging/PageSetting';
import { ComponentWithPagination } from '../models/_Pagging/ComponentWithPagination';
import { ItemsCollectionResponce } from '../models/_ApiBase/ItemsCollectionResponce';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { AttachFileModel } from '../models/_ApiBase/AttachFileModel';
import { ChatMessage } from '../models/Chat/ChatMessage';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { ChatMember } from '../models/Chat/ChatMember';
import { EmployeesService } from './employees.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmData } from '../models/_ConfirmDialog/ConfirmData';
import { ConfirmationDialogComponent } from '../components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatMessageViewedInfo } from '../models/Chat/ChatMessageViewedInfo';
import { CurrentUserDataService } from './current-user-data.service';
import { ChatMessageAttachedFile } from '../models/Chat/ChatMessageAttachedFile';
import { UpdateChatRequest } from '../models/Chat/UpdateChatRequest';
import { ApiResponseSuccessfullUpdate } from '../models/_ApiBase/ApiResponseSuccessfullUpdate';
import { Employee } from '../models/Employees/Employee';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BaseCrudService<Chat, Chat, UpdateChatRequest> implements ComponentWithPagination, OnDestroy  {
  override typeName: string = 'Chats';
  public chats: Array<Chat> = [];
  public pageSettings: PageSettings = new PageSettings(this, true);
  private currentUserEmployeeId: string;
  private chatsSubject: Subject<Array<Chat>> = new Subject<Array<Chat>>();
  private chatsHubConnection!: HubConnection;
  private chatsHubConnectionId: string | null = null;
  private maxMessageTextLength: number = 2000;
  private _subscriptions: Subscription[] = [];

  constructor(
    protected override httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private currentUserDataService: CurrentUserDataService,
    private employeesService: EmployeesService,
  ) {
    super(httpClient);
    this.currentUserEmployeeId = currentUserDataService.GetCurrentUserEmployeeId();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub)=> {
      sub.unsubscribe();
    })
  }

  public InitializeChats() {
    this.currentUserEmployeeId = this.currentUserDataService.GetCurrentUserEmployeeId();
    this.pageSettings.ApplyFilter();
    this.InitializeSignalRConnection();
  }

  public DeInitializeChats() {
    this.currentUserEmployeeId = '';
    this.DeInitializeSignalRConnection();
  }

  public Refresh() {    
    this.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Chat>) => {
          this.chats = response.items
            .map(chat => new Chat(this.currentUserEmployeeId, chat));
          this.chatsSubject.next(this.chats);
          this.pageSettings.totalItems = response.totalItems;
          this.PopulateChatAndChatMembersAvatars(this.chats);
        }
      });
  }

  public LoadMoreChats(): Observable<boolean> {
    this.pageSettings.curentPage++;
    return this.GetPage(this.pageSettings)
      .pipe(
        map((response: ItemsCollectionResponce<Chat>) => {
          let newChats = response.items
            .map(chat => new Chat(this.currentUserEmployeeId, chat));
          this.PopulateChatAndChatMembersAvatars(newChats);
          this.chats = this.chats.concat(newChats);
          this.pageSettings.totalItems = response.totalItems;

          return true;
        })
      );
  }

  public LoadMoreMessages(chat: Chat, startIndex: number, itemsPerPage: number): Observable<ItemsCollectionResponce<ChatMessage>> {
    return this.httpClient.get<ItemsCollectionResponce<ChatMessage>>
      (BackendApiEndpoints.get_more_messages_for_chat_endpoint, {
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
      });
  }

  public CreateNewChat(newChat: Chat): Observable<Chat> {
    const textForNewMessageTempSave = newChat.textForNewMessage.trim();
    let newChatWithoutExtraInfo = new Chat(this.currentUserEmployeeId, newChat);
    newChatWithoutExtraInfo.messages = [];
    newChatWithoutExtraInfo.chatMembers.forEach((ch: ChatMember) => {
      ch.employee = null;
      ch.personClient = null;
      ch.organizationClient = null;
      ch.avatar = null;
    });
    newChatWithoutExtraInfo.SetChatAvatar(null);
    newChatWithoutExtraInfo.lastMessage = null;
    newChatWithoutExtraInfo.selectedFilesForNewMessage = [];
    if (newChat.textForNewMessage && newChat.textForNewMessage.trim() != '') {
      while (newChat.textForNewMessage.trim().length > this.maxMessageTextLength) {
        let message = new ChatMessage();
        message.text = newChat.textForNewMessage.trim().substring(0, 2000);
        newChat.textForNewMessage = newChat.textForNewMessage.trim().substring(2000);
        newChatWithoutExtraInfo.messages.push(message);
      }
      if (newChat.textForNewMessage && newChat.textForNewMessage.trim() != '') {
        let message = new ChatMessage();
        message.text = newChat.textForNewMessage.trim().substring(0);
        newChat.selectedFilesForNewMessage.forEach(af => {
          let newAttachedFile = new ChatMessageAttachedFile(undefined, af)
          newAttachedFile.mediumImage = newAttachedFile.fileContent;
          newAttachedFile.fileName = newAttachedFile.fileContent.fileName;
          message.attachedFiles.push(newAttachedFile);
        })
        newChatWithoutExtraInfo.messages.push(message);
      }
    }
    newChat.textForNewMessage = textForNewMessageTempSave;
    return this.PostChatToBackend(newChatWithoutExtraInfo)
      .pipe(
        map((response: Chat) => {
          if (response.id) {
            newChat.textForNewMessage = '';
            newChat.selectedFilesForNewMessage = [];
            newChat = new Chat(this.currentUserEmployeeId, response);
            this.chats.unshift(newChat);
            this.router.navigate(['Chats', newChat?.id]);
            this.PopulateChatAndChatMembersAvatars([newChat]);
            return newChat;
          }
          return response;
        })
      );
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

  public CreateNewGroupChat(chatMembers: Array<ChatMember>, isGroupChat: boolean = false, chatName: string = ''): Observable<Chat> {
    let newGroupChat = new Chat(this.currentUserEmployeeId);
    newGroupChat.chatMembers = chatMembers;
    newGroupChat.isGroupChat = isGroupChat;
    newGroupChat.name = chatName;
    return this.CreateNewChat(newGroupChat);
  }

  public GetPotentialChatMembersPage(pageSettings: PageSettings, chatId: string | null = null): Observable<ItemsCollectionResponce<ChatMember>> {
    let params = new HttpParams()
      .append('startIndex', pageSettings.curentPage * pageSettings.itemsPerPage)
      .append('itemsPerPage', pageSettings.itemsPerPage)
      .append('filterString', pageSettings.currentFilterString);
    if (chatId) {
      params = params.append('chatId', chatId);
    }
    return this.httpClient.get<ItemsCollectionResponce<ChatMember>>
      (BackendApiEndpoints.get_potential_chat_members_endpoint, {
        params: params
      });
  }

  public AddChatMembersToChat(chatMembers: Array<ChatMember>, chatId: string): Observable<any> {
    return this.httpClient.post<any>
      (BackendApiEndpoints.add_chat_members_to_chat_endpoint(chatId), chatMembers);
  }

  public GetPersonalChatWithInterlocutor(interlocutor: ChatMember): Observable<Chat> {
    return this.GetChatForInterlocutor(interlocutor)
      .pipe(
        map((response: Chat) => {
          if (response) {
            let newChat = new Chat(this.currentUserEmployeeId, response);
            let cmInterlocutor = newChat.chatMembers.find(
              e => (e.employeeId && e.employeeId == interlocutor.employeeId)
                || (e.personClientId && e.personClientId == interlocutor.personClientId)
                || (e.organizationClientId && e.organizationClientId == interlocutor.organizationClientId))
            if (cmInterlocutor) {
              cmInterlocutor.avatar = interlocutor.avatar;
            }
            this.SetAnAvatarForYourselfInTheChat(newChat);
            return newChat;
          }
          else {
            let newChat = new Chat(this.currentUserEmployeeId);
            newChat.isGroupChat = false;
            newChat.chatMembers.push(interlocutor);
            if (!interlocutor.avatar && interlocutor.employeeId) {
              this.employeesService.GetEmployeeSmallAvatar(interlocutor.employeeId)
                .subscribe({
                  next: (response: AttachFileModel) => {
                    newChat.SetChatAvatar(response);
                  }
                })
            }
            else {
              newChat.SetChatAvatar(interlocutor.avatar);
            }
            return newChat;
          }
        })
      );
  }

  public DeleteChat(chatToDelete: Chat) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить чат "${chatToDelete.GetChatName()}"?`;
    confirmData.subContent = '(ВНИМАНИЕ: Будут удалены все участники чата, вся история сообщений и прикреплённые файлы)';
    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    //TODOsecondary доделать функцию (чтобы у собеседников чат тоже удалялся в лайве)
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.Delete(chatToDelete.id)
            .subscribe({
              next: () => {
                this.snackBar.open(
                  `Чат ${chatToDelete.GetChatName()} удалён`,
                  "Ок",
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 4000,
                    panelClass: ['snack-bar-success']
                  });
                this.chats = this.chats.filter((chat: Chat) => chat.id != chatToDelete.id);
                this.router.navigate(['Chats']);
              }
            })
        }
      },
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

  public DeleteChatMember(chat: Chat, chatMember: ChatMember): void {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить "${chatMember.GetDisplayName()}" из чата?`;
    confirmData.subContent = '(Его сообщения и прикреплённые файлы при этом сохранятся в истории чата)';
    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          chatMember.isDeleting = true;
          this.PostChatMemberDeleteToBackend(chat.id, chatMember.id)
            .subscribe({
              next: (response: any) => {
                chatMember.isDeleting = false;
              },
              error: (error: any) => {
                chatMember.isDeleting = false;
              }
            });
        }
      },
    });
  }

  public ReCreateNewChat(chat: Chat | null | undefined): Chat | null {
    if (!chat) return null;
    let newChat = new Chat(this.currentUserEmployeeId, chat)
    this.PopulateChatAndChatMembersAvatars([newChat]);
    return newChat;
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

  public PopulateImageMediumContent(image: ChatMessageAttachedFile) {
    image.mediumImage.isFileContentProcessing = true;
    this.GetChatMessageAttachedFileContent(image.id, true)
      .subscribe({
        next: (response: AttachFileModel) => {
          image.mediumImage = new AttachFileModel(response);
          image.mediumImage.isFileContentProcessing = false;
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

  public PopulateChatBigAvatar(chat: Chat) {
    if (chat.isGroupChat) {
      this.GetChatBigAvatar(chat.id)
        .subscribe({
          next: (response: AttachFileModel) => {
            chat.SetChatBigAvatar(response);
          }
        })
    }
    else {
      const interlocutor = chat.GetInterlocutor();
      if (interlocutor?.employeeId) {
        this.employeesService.GetEmployeeBigAvatar(interlocutor.employeeId)
          .subscribe({
            next: (response: AttachFileModel) => {
              if (response && response.fileContent) {
                const employeeAvatar = new AttachFileModel(response);
                chat.SetChatBigAvatar(employeeAvatar);
              }
            }
          })
      }
    }
  }

  public override Update(updateModel: UpdateChatRequest): Observable<ApiResponseSuccessfullUpdate> {
    let body = this.SpecifyDateFormat(updateModel);
    return this.httpClient.put<ApiResponseSuccessfullUpdate>(
      BackendApiEndpoints.Update(this.typeName),
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

  private PostChatToBackend(newModel: Chat): Observable<Chat> {
    let body = this.SpecifyDateFormat(newModel);
    return this.httpClient.post<Chat>(
      BackendApiEndpoints.Create(this.typeName),
      body, {
      params: {
        eventOriginConnectionId: this.chatsHubConnectionId ?? ''
      }
    }
    );
  }

  private PostMessageToBackend(newMessage: ChatMessage): Observable<ApiResponseSuccessfullCreate> {
    let body = this.SpecifyDateFormat(newMessage);
    return this.httpClient.post<ApiResponseSuccessfullCreate>(
      BackendApiEndpoints.create_chat_message_endpoint,
      body, {
      params: {
        eventOriginConnectionId: this.chatsHubConnectionId ?? ''
      }
    }
    );
  }

  private PostChatMemberDeleteToBackend(chatId: string, chatMemberId: string): Observable<any> {
    return this.httpClient.delete<any>(
      BackendApiEndpoints.get_chat_member_delete_from_chat_endpoint(chatId, chatMemberId),
    );
  }

  private PostMessageViewedInfoToBackend(messageId: string, yourselfId: string): Observable<ChatMessageViewedInfo> {
    return this.httpClient.post<ChatMessageViewedInfo>(
      BackendApiEndpoints.view_chat_message_endpoint(messageId, yourselfId),
      null, {
      params: {
        eventOriginConnectionId: this.chatsHubConnectionId ?? ''
      }
    }
    )
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
      this.SetAnAvatarForYourselfInTheChat(chat);
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
      BackendApiEndpoints.get_chat_small_avatar_endpoint(chatId)
    );
  }

  private GetChatBigAvatar(chatId: string): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_chat_big_avatar_endpoint(chatId)
    );
  }

  private GetChatMemberSmallAvatar(chatMemberId: string): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_chat_member_small_avatar_endpoint(chatMemberId)
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
      this.ProcessNewIncomingMessageViewedInfo(chatId, newInfo);
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

    this.chatsHubConnection.on('ChatMemberAdded', (chatId: string, chatMemeber: ChatMember) => {
      this.ProcessChatMemberAdded(chatId, chatMemeber);
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
      this.Get(newMessage.chatId)
        .subscribe({
          next: (newChat: Chat) => {
            if (newChat.id) {
              newChat = new Chat(this.currentUserEmployeeId, newChat);
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
      newChat = new Chat(this.currentUserEmployeeId, newChat);
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

  private ProcessChatMemberAdded(chatId: string, newChatMemeber: ChatMember) {
    if (chatId && newChatMemeber) {
      let chat = this.chats.find(e => e.id == chatId);
      if (chat) {
        newChatMemeber = new ChatMember(newChatMemeber);
        this.GetChatMemberSmallAvatar(newChatMemeber.id)
          .subscribe({
            next: (response: AttachFileModel) => {
              newChatMemeber.avatar = response;
            }
          })
        chat.AddChatMember(newChatMemeber);
      }
    }
  }

  private GetChatForInterlocutor(interlocutor: ChatMember): Observable<any> {
    return this.httpClient.post<Chat | null>(
      BackendApiEndpoints.get_chat_for_interlocutor_endpoint,
      interlocutor
    );
  }

  private SetAnAvatarForYourselfInTheChat(chat: Chat): void {
    let yourself = chat.GetYourself();
    if (this.currentUserDataService.currentUserEmployeeShortInfo?.employeeSmallAvatar) {
      if (yourself) {
        yourself.avatar = this.currentUserDataService.currentUserEmployeeShortInfo?.employeeSmallAvatar;
      }
    }    
    //TO track changes
    let sub = this.currentUserDataService.currentUserEmployeeShortInfoSubject.asObservable().subscribe({
      next: (response: Employee) => {
        if (yourself) {
          yourself.avatar = response.employeeSmallAvatar;
        }
      }
    })
    this._subscriptions.push(sub);
  }  

  private GetChatMessageAttachedFileContent(chatMessageAttachedFileId: string, isImageMedium: boolean = false): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_chat_message_attached_file_content_endpoint(chatMessageAttachedFileId), {
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
