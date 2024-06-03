import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { Chat } from 'src/app/models/Chat/Chat';
import { ChatMember } from 'src/app/models/Chat/ChatMember';
import { UpdateChatRequest } from 'src/app/models/Chat/UpdateChatRequest';
import { AccessService } from 'src/app/services/access.service';
import { ChatService } from 'src/app/services/chat.service';
import { PotentialChatMembersSelectorComponent } from '../potential-chat-members-selector/potential-chat-members-selector.component';
import { WrapperForValueType } from 'src/app/models/_ApiBase/WrapperForValueType';
import { FormatHelper } from 'src/app/helpers/FormatHelper';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent extends ComponentWithAccessSegregation {
  public defaultImageSrc: string = 'assets/images/default.png';
  public isChatUpdating: WrapperForValueType<boolean> = new WrapperForValueType(false);
  private newChatAvatar: AttachFileModel | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public chat: Chat,
    private chatService: ChatService,
    protected override accessService: AccessService,
    private dialogRef: MatDialogRef<ChatDetailsComponent>,
    private adapter: DateAdapter<any>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    if (!chat?.GetChatBigAvatar()) {
      this.chatService.PopulateChatBigAvatar(chat);
    }
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public SaveChanges() {
    this.isChatUpdating.value = true;
    const updateRequest = new UpdateChatRequest(this.chat, this.newChatAvatar);
    this.chatService.Update(updateRequest)
      .subscribe({
        next: (response: ApiResponseSuccessfullUpdate) => {
          if (response) {
            this.chat.updatedOn = response.updatedOn;
            this.chat.updatedByUser = response.updatedByUser;
            if (this.newChatAvatar?.fileContent) {
              this.chat.SetChatAvatar(this.newChatAvatar);
            }
            this.isChatUpdating.value = false;
            this.snackBar.open(
              "Информация обновлена",
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-success']
              });
          }
        },
        error: (response: any) => {
          this.isChatUpdating.value = false;
        }
      })
  }

  public ProcessChatAvatar(imageInput: HTMLInputElement) {
    FormatHelper.ProcessFilesFromInput(imageInput, this.isChatUpdating, this.snackBar, this.setProcessedAvatar.bind(this));    
    imageInput.value = '';
  }  

  public DeleteChat(): void {
    if (this.chat) {
      this.chatService.DeleteChat(this.chat);
      this.CloseForm();
    }
  }

  public OpenChatMemberSelectorToAdd() {
    const dialogFormRef = this.dialog.open(PotentialChatMembersSelectorComponent,
      { data: this.chat }
    );
    dialogFormRef.afterClosed().subscribe({
      next: (selectedChatMember: ChatMember) => {
        if (selectedChatMember) {
          this.chatService.AddChatMembersToChat([selectedChatMember], this.chat.id)
            .subscribe({
              next: (response: any) => {

              },
              error: (response: any) => {

              }
            })
        }
      },
    });
  }

  public DeleteChatMemberFromChat(member: ChatMember) {
    this.chatService.DeleteChatMember(this.chat, member);
  }

  private setProcessedAvatar(processedAvatar: AttachFileModel) {
    this.chat.SetChatBigAvatar(processedAvatar);
    this.newChatAvatar = processedAvatar;
  }
}
