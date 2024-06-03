import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { Chat } from 'src/app/models/Chat/Chat';
import { ChatMember } from 'src/app/models/Chat/ChatMember';
import { ChatMemberType } from 'src/app/models/Chat/ChatMemberType';
import { AccessService } from 'src/app/services/access.service';
import { ChatService } from 'src/app/services/chat.service';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-potential-chat-members-selector',
  templateUrl: './potential-chat-members-selector.component.html',
  styleUrls: ['./potential-chat-members-selector.component.css']
})
export class PotentialChatMembersSelectorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  potentialChatMembers: Array<ChatMember> = [];
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';
  public newChatName: string = '';
  public isChatOpening: boolean = false;
  public isChatMembersLoading: boolean = false;

  //TODO длинное имя ломает разметку, а на маленьких экранах из-за паддинга ничего не видно

  constructor(
    @Inject(MAT_DIALOG_DATA) public chat: Chat | null | undefined,
    private chatService: ChatService,
    protected override accessService: AccessService,
    private employeesService: EmployeesService,
    private dialogRef: MatDialogRef<PotentialChatMembersSelectorComponent>,
    private adapter: DateAdapter<any>,
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

  public ChatMemberSelected(chatMember: ChatMember) {
    this.dialogRef.close(chatMember);
  }

  private PopulatePotentialChatMembers() {
    this.isChatMembersLoading = true;    
    this.chatService.GetPotentialChatMembersPage(this.pageSettings, this.chat?.id)
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
