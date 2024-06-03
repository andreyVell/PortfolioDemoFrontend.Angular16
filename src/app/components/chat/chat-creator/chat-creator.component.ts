import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatMember } from 'src/app/models/Chat/ChatMember';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { ChatsPageComponent } from 'src/app/pages/chats-page/chats-page.component';
import { AccessService } from 'src/app/services/access.service';
import { ChatMemberType } from 'src/app/models/Chat/ChatMemberType';
import { EmployeesService } from 'src/app/services/employees.service';
import { Chat } from 'src/app/models/Chat/Chat';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-creator',
  templateUrl: './chat-creator.component.html',
  styleUrls: ['./chat-creator.component.css']
})
export class ChatCreatorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  potentialChatMembers: Array<ChatMember> = [];
  selectedPotentialChatMembers: Array<ChatMember> = [];
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';
  public newChatName: string = '';
  public isChatOpening: boolean = false;
  public isChatMembersLoading: boolean = false;
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public chatsPage: ChatsPageComponent | null | undefined,
    private chatService: ChatService,
    protected override accessService: AccessService,
    private employeesService: EmployeesService,
    private dialogRef: MatDialogRef<ChatCreatorComponent>,
    private adapter: DateAdapter<any>,
    private router: Router,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public Refresh(): void {
    this.PopulatePotentialChatMembers();
  }

  public SelectChatMember(chatMember: ChatMember): void {
    if (!this.selectedPotentialChatMembers.find(e => e == chatMember)) {
      this.selectedPotentialChatMembers.unshift(chatMember);
    }
  }

  public UnSelectChatMember(chatMember: ChatMember): void {
    this.selectedPotentialChatMembers = this.selectedPotentialChatMembers.filter(e => e != chatMember);
  }

  public CreateOrOpenChat() {
    this.isChatOpening = true;
    if (this.selectedPotentialChatMembers.length == 1 && !this.newChatName) {
      let interlocutor = this.selectedPotentialChatMembers[0];
      if (!interlocutor) return;
      this.chatService.GetPersonalChatWithInterlocutor(interlocutor)
        .subscribe({
          next: (chat: Chat) => {
            if (chat) {
              if (chat.id) {
                this.router.navigate(['Chats', chat?.id]);
                this.chatsPage?.ChatSelected(chat);
              }
              else {
                this.chatsPage?.OpenNewPersonalChat(chat);
              }

              this.dialogRef.close(true);
            }
            else {
              this.isChatOpening = false;
            }
          },
          error: (er: any) => {
            this.isChatOpening = false;
          }
        });
    }
    else {
      this.chatService.CreateNewGroupChat(this.selectedPotentialChatMembers, true, this.newChatName)
        .subscribe({
          next: (chat: Chat) => {
            if (chat) {
              this.router.navigate(['Chats', chat?.id]);
              this.chatsPage?.ChatSelected(chat);
              this.dialogRef.close(true);
            }
            else {
              this.isChatOpening = false;
            }
          },
          error: (er: any) => {
            this.isChatOpening = false;
          }
        });
    }
  }

  public IsMemberSelected(chatMember: ChatMember): boolean {
    return !!this.selectedPotentialChatMembers.find(
      e => (e.employeeId && e.employeeId == chatMember.employeeId)
        || (e.personClientId && e.personClientId == chatMember.personClientId)
        || (e.organizationClientId && e.organizationClientId == chatMember.organizationClientId));
  }

  public LoadMorePotentialChatMembers(): void {
    if (this.pageSettings.totalItems > this.potentialChatMembers.length && !this.isChatOpening) {
      this.isChatMembersLoading = true;
      this.pageSettings.curentPage++;
      this.chatService.GetPotentialChatMembersPage(this.pageSettings)
        .subscribe({
          next: (response: ItemsCollectionResponce<ChatMember>) => {
            let newpotentialChatMembers = response.items.map(cm => new ChatMember(cm));
            this.PopulatePotentialChatMembersAvatars(newpotentialChatMembers);
            this.potentialChatMembers = this.potentialChatMembers.concat(newpotentialChatMembers);
            this.pageSettings.totalItems = response.totalItems;
            this.isChatMembersLoading = false;
          },
          error: (error: any) => {
            this.isChatMembersLoading = false;
          }
        })
    }
  }

  private PopulatePotentialChatMembers() {
    this.isChatMembersLoading = true;
    this.chatService.GetPotentialChatMembersPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<ChatMember>) => {
          this.potentialChatMembers = response.items.map(cm => new ChatMember(cm));;
          this.pageSettings.totalItems = response.totalItems;
          this.PopulatePotentialChatMembersAvatars(this.potentialChatMembers);
          this.isChatMembersLoading = false;
        },
        error: (err: any) => {
          this.isChatMembersLoading = false;
        }
      })
  }

  private PopulatePotentialChatMembersAvatars(cmToPopulateAvatars: Array<ChatMember>) {
    cmToPopulateAvatars
      .filter(e => e.type == ChatMemberType.Employee)
      .forEach((chatMember: ChatMember) => {
        this.employeesService.GetEmployeeSmallAvatar(chatMember.employeeId ?? '')
          .subscribe({
            next: (response: AttachFileModel) => {
              chatMember.avatar = response;
            }
          })
      })
  }
}
