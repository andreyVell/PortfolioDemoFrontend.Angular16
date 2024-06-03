import { AttachFileModel } from "../_ApiBase/AttachFileModel";
import { EntityBase } from "../_ApiBase/EntityBase";
import { ChatMember } from "./ChatMember";
import { ChatMemberType } from "./ChatMemberType";
import { ChatMessage } from './ChatMessage';

export class Chat extends EntityBase {
    public name: string = '';
    public isGroupChat: boolean | null = null;
    public lastMessage: ChatMessage | null = null;
    public notifications: number = 0;
    public totalMessagesCount: number = 0;
    public messages: Array<ChatMessage> = [];
    public textForNewMessage: string = '';
    public selectedFilesForNewMessage: Array<AttachFileModel> = [];
    public chatMembers: Array<ChatMember> = [];
    public scrollPostion: number = 0;
    private _lastUnviewedMessage: ChatMessage | null = null;
    private _chatAvatar: AttachFileModel | null = null;
    private _chatBigAvatar: AttachFileModel | null = null;
    private _chatMemberYourself!: ChatMember | null;
    private _chatMemberInterlocutor!: ChatMember | null;
    private _millisecondsIn15Minutes: number = 900000;

    public get lastUnviewedMessage(): ChatMessage | null{
        return this._lastUnviewedMessage;
    }

    constructor(private currentUserChatMemberIdentity: string, init?: Partial<Chat>) {
        super();
        Object.assign(this, init);
        if (this.lastMessage) {
            this.lastMessage = new ChatMessage(this.lastMessage);
        }
        if (this.chatMembers) {
            this.chatMembers = this.chatMembers.map(cm => new ChatMember(cm));
        }
        if (this.messages) {
            if (this.messages.length > 0) {
                this.messages[0] = new ChatMessage(this.messages[0]);
            }
            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i + 1]) {
                    this.messages[i + 1] = new ChatMessage(this.messages[i + 1]);
                }
                let currMessage = this.messages[i];
                let prevMessage = this.messages[i + 1];
                let nextMessage = this.messages[i - 1];

                if (!this.IsMessageViewedByYou(currMessage) && !this.IsThisMessageYours(currMessage)) {
                    this._lastUnviewedMessage = currMessage;
                }
                //15 mins delay and date changed breaks groups union
                if (prevMessage && currMessage.ownerId == prevMessage.ownerId
                    && prevMessage.createdOn?.getFullYear() == currMessage?.createdOn?.getFullYear()
                    && prevMessage.createdOn?.getMonth() == currMessage?.createdOn?.getMonth()
                    && prevMessage.createdOn?.getDate() == currMessage?.createdOn?.getDate()
                    && (prevMessage.createdOn?.getTime() - currMessage?.createdOn?.getTime() < this._millisecondsIn15Minutes)
                ) {
                    currMessage.previousGroupMessage = prevMessage;
                }
                if (nextMessage && currMessage.ownerId == nextMessage.ownerId
                    && currMessage.createdOn?.getFullYear() == nextMessage?.createdOn?.getFullYear()
                    && currMessage.createdOn?.getMonth() == nextMessage?.createdOn?.getMonth()
                    && currMessage.createdOn?.getDate() == nextMessage?.createdOn?.getDate()
                    && (currMessage.createdOn?.getTime() - nextMessage?.createdOn?.getTime() < this._millisecondsIn15Minutes)
                ) {
                    currMessage.nextGroupMessage = nextMessage;
                }
            }
        }
        else {
            this.messages = new Array<ChatMessage>();
        }
    }

    public GetChatName(): string {
        if (this.isGroupChat) {
            if (this.name) return this.name;
            let chatName = '';
            let yourselfId = this.GetYourself()?.id;
            this.chatMembers
                .filter(e => e.id != yourselfId)
                .forEach((cm: ChatMember) => {
                    chatName += cm.GetOnlyName() + ', ';
                })
            return chatName.slice(0, -2);
        }
        let interlocutor = this.GetInterlocutor();
        if (interlocutor) {
            switch (interlocutor.type) {
                case ChatMemberType.Employee: {
                    return interlocutor.employee?.GetLastNameAndFirstName() ?? '';
                }
                case ChatMemberType.OrganizationClient: {
                    return interlocutor.organizationClient?.GetFullName() ?? '';
                }
                case ChatMemberType.PersonClient: {
                    return interlocutor.personClient?.GetFullName() ?? '';
                }
            }
        }
        return '';
    }

    public GetChatAvatar(): string | null | undefined {
        if (this.isGroupChat && this._chatAvatar?.fileContent) {
            return this._chatAvatar?.fileContent;
        }
        else {
            return this.GetInterlocutor()?.avatar?.fileContent;
        }
    }

    public GetChatBigAvatar(): string | null | undefined {
        return this._chatBigAvatar?.fileContent;
    }

    public GetAvatarForMessageOwner(message: ChatMessage): string | null | undefined {
        return this.GetMessageOwner(message)?.avatar?.fileContent;
    }

    public GetDisplayNameForMessageOwner(message: ChatMessage): string | null | undefined {
        return this.chatMembers.find(e => e.id == message.ownerId)?.GetShortDisplayName();
    }

    public GetLastMessageContent(): string {
        let text = this.lastMessage?.GetText() ?? '';
        if (!text && (this.lastMessage?.attachedFiles?.length ?? 0) > 0) {
            text = `Вложения(${this.lastMessage?.attachedFiles.length})`;
        }
        return text;
    }

    public GetLastMessageDateTime(): string {
        let lastMessageDate = this.lastMessage?.createdOn;
        if (lastMessageDate) {
            let currentDate = new Date();
            if (currentDate.getFullYear() == lastMessageDate.getFullYear()
                && currentDate.getMonth() == lastMessageDate.getMonth()
                && currentDate.getDate() == lastMessageDate.getDate()) {
                return lastMessageDate.toLocaleTimeString().substring(0, 5);
            }
            if (currentDate.getFullYear() == lastMessageDate.getFullYear()
                && currentDate.getMonth() == lastMessageDate.getMonth()
                && currentDate.getDate() - lastMessageDate.getDate() == 1) {
                return 'Вчера';
            }
            if (currentDate.getFullYear() == lastMessageDate.getFullYear()) {
                return `${lastMessageDate.getDate()} ${lastMessageDate.toLocaleString('default', { month: 'long' }).substring(0, 3)}`;
            }
            return `${lastMessageDate.getDate()} ${lastMessageDate.toLocaleString('default', { month: 'long' }).substring(0, 3)} ${lastMessageDate.getFullYear()}`;
        }
        return '';
    }

    public GetYourself(): ChatMember | null {
        return this._chatMemberYourself ??
            (this._chatMemberYourself = this.chatMembers.find(
                x => x.employeeId == this.currentUserChatMemberIdentity
                    || x.personClientId == this.currentUserChatMemberIdentity
                    || x.organizationClientId == this.currentUserChatMemberIdentity) ?? null);
    }

    public GetInterlocutor(): ChatMember | null {
        if (this.isGroupChat) return null;
        if (this.chatMembers.length == 1) return this.chatMembers[0];

        return this._chatMemberInterlocutor ??
            (this._chatMemberInterlocutor = this.chatMembers.find(
                x => x.employeeId != this.currentUserChatMemberIdentity
                    && x.personClientId != this.currentUserChatMemberIdentity
                    && x.organizationClientId != this.currentUserChatMemberIdentity) ?? null);
    }

    public IsThisMessageYours(message: ChatMessage | null): boolean {
        if (!message) return false;
        return message.ownerId == this.GetYourself()?.id;
    }

    public GetMessageOwner(message: ChatMessage | null): ChatMember | null {
        if (message) {
            return this.chatMembers.find(e => e.id == message.ownerId) ?? null;
        }
        return null;
    }

    public AddNewMessage(newMessage: ChatMessage): ChatMessage {
        newMessage = new ChatMessage(newMessage);
        let firstMessage = this.messages[0];
        this.messages.unshift(newMessage);
        this.totalMessagesCount++;

        if (!this._lastUnviewedMessage) {
            if (!this.IsMessageViewedByYou(newMessage) && !this.IsThisMessageYours(newMessage)) {
                this._lastUnviewedMessage = newMessage;
            }
        }
        //15 mins delay and date changed breaks groups union
        if (firstMessage && firstMessage.ownerId == newMessage.ownerId
            && newMessage.createdOn?.getFullYear() == firstMessage?.createdOn?.getFullYear()
            && newMessage.createdOn?.getMonth() == firstMessage?.createdOn?.getMonth()
            && newMessage.createdOn?.getDate() == firstMessage?.createdOn?.getDate()
            && (newMessage.createdOn?.getTime() - firstMessage?.createdOn?.getTime() < this._millisecondsIn15Minutes)
        ) {
            firstMessage.nextGroupMessage = newMessage;
            newMessage.previousGroupMessage = firstMessage;
        }
        this.lastMessage = newMessage;
        return newMessage;
    }

    public AddNewMessageAtEnd(newMessage: ChatMessage): ChatMessage {
        newMessage = new ChatMessage(newMessage);
        let lastMessage = this.messages[this.messages.length - 1];
        this.messages.push(newMessage);

        if (!this.IsMessageViewedByYou(newMessage) && !this.IsThisMessageYours(newMessage)) {
            this._lastUnviewedMessage = newMessage;
        }

        //15 mins delay and date changed breaks groups union
        if (lastMessage && lastMessage.ownerId == newMessage.ownerId
            && newMessage.createdOn?.getFullYear() == lastMessage?.createdOn?.getFullYear()
            && newMessage.createdOn?.getMonth() == lastMessage?.createdOn?.getMonth()
            && newMessage.createdOn?.getDate() == lastMessage?.createdOn?.getDate()
            && (lastMessage.createdOn?.getTime() - newMessage?.createdOn?.getTime() < this._millisecondsIn15Minutes)
        ) {
            newMessage.nextGroupMessage = lastMessage;
            lastMessage.previousGroupMessage = newMessage;
        }
        return newMessage;
    }

    public NeedToShowHistoryDate(chatMessageIndex: number): boolean {
        return this.messages[chatMessageIndex].createdOn?.getFullYear() != this.messages[chatMessageIndex + 1]?.createdOn?.getFullYear()
            || this.messages[chatMessageIndex].createdOn?.getMonth() != this.messages[chatMessageIndex + 1]?.createdOn?.getMonth()
            || this.messages[chatMessageIndex].createdOn?.getDate() != this.messages[chatMessageIndex + 1]?.createdOn?.getDate();
    }

    public NeedToShowNewMessageLabel(chatMessage: ChatMessage): boolean {
        return chatMessage == this._lastUnviewedMessage;
    }

    public GetLastMessageOwnerName(): string {
        if (!this.lastMessage) {
            return '';
        };
        if (this.lastMessage.isSystem) {
            return '';
        }
        if (this.IsLastMessageYours()) {
            return 'Вы:';
        }
        if (this.isGroupChat) {
            return this.GetMessageOwner(this.lastMessage)?.GetOnlyName() + ':' ?? '';
        }
        return '';
    }

    public IsLastMessageYours(): boolean {
        return this.IsThisMessageYours(this.lastMessage)
    }

    public SetChatAvatar(newAvatar: AttachFileModel | null): void {
        this._chatAvatar = newAvatar;
    }

    public SetChatBigAvatar(newAvatar: AttachFileModel | null): void {
        this._chatBigAvatar = newAvatar;
    }

    public IsMessageViewedByYou(message: ChatMessage | null): boolean {
        if (!message) { return false };
        const yourselfId = this.GetYourself()?.id;
        if (!yourselfId) { return false };
        if (message.viewedInfos.find(e => e.viewedById == yourselfId)) return true;
        return false;
    }

    public IsLastMessageViewedByYou(): boolean {
        if (!this.lastMessage) return false;
        const yourselfId = this.GetYourself()?.id;
        if (!yourselfId) return false;
        if (this.lastMessage.viewedInfos.find(e => e.viewedById == yourselfId)) return true;
        return false;
    }

    public IsMessageViewed(message: ChatMessage | null): boolean {
        if (!message) return false;
        if ((message.viewedInfos?.length ?? 0) > 0) return true;
        return false;
    }

    public IsLastMessageViewed(): boolean {
        if (!this.lastMessage) return false;
        if ((this.lastMessage.viewedInfos?.length ?? 0) > 0) return true;
        return false;
    }

    public GetCountOfLastUnviewedMessages(): number | null {
        let count = 0;
        this.messages.forEach(message => {
            if (!this.IsThisMessageYours(message) && !this.IsMessageViewedByYou(message)) {
                count++;
            }
        });
        if (count == 0) return null;
        return count;
    }

    public DeleteFile(file: AttachFileModel) {
        this.selectedFilesForNewMessage = this.selectedFilesForNewMessage.filter((sraf: AttachFileModel) => sraf != file);
    }

    public DeleteChatMember(chatMemberId: string): void {
        this.chatMembers = this.chatMembers.filter(e => e.id != chatMemberId);
    }

    public AddChatMember(chatMember: ChatMember): void {
        this.chatMembers.push(chatMember);
    }

    public HideNewMessageLabel():void{
        this._lastUnviewedMessage = null;
    }
}