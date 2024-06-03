import { EntityBase } from "../_ApiBase/EntityBase";
import { ChatMessageAttachedFile } from "./ChatMessageAttachedFile";
import { ChatMessageViewedInfo } from "./ChatMessageViewedInfo";

export class ChatMessage extends EntityBase {
    public ownerId: string = '';
    public chatId: string = '';
    public text: string | null = null;
    public isSystem: boolean | null = null;
    public nextGroupMessage: ChatMessage | null | undefined = null;
    public previousGroupMessage: ChatMessage | null | undefined = null;
    public isNotSended: boolean | null = false;
    public viewedInfos: Array<ChatMessageViewedInfo> = [];
    public isReading: boolean = false;
    public attachedFiles: Array<ChatMessageAttachedFile> = [];
    public isRendered: boolean = false;

    constructor(init?: Partial<ChatMessage>) {
        super();
        Object.assign(this, init);
        if (this.createdOn) {
            this.createdOn = new Date(this.createdOn);
        }
        else {
            this.createdOn = new Date();
        }
        if (this.viewedInfos) {
            this.viewedInfos = this.viewedInfos.map(vi => new ChatMessageViewedInfo(vi));
        }
        if (this.attachedFiles) {
            this.attachedFiles = this.attachedFiles.map(af => new ChatMessageAttachedFile(af));
        }
    }

    public GetMessageTime(): string {
        return `${this.createdOn.getHours().toString().padStart(2, '0')}:${this.createdOn.getMinutes().toString().padStart(2, '0')}`;
    }

    public GetGroupStyleClass(): string {
        if (!this.previousGroupMessage && this.nextGroupMessage) {
            return 'first-in-message-group';
        }
        if (this.previousGroupMessage && this.nextGroupMessage) {
            return 'middle-in-message-group';
        }
        if (this.previousGroupMessage && !this.nextGroupMessage) {
            return 'last-in-message-group';
        }
        if (!this.previousGroupMessage && !this.nextGroupMessage) {
            return 'one-in-message-group';
        }
        return '';
    }

    public IsLastMessageInGroup(): boolean {
        return !this.nextGroupMessage;
    }

    public IsFirstMessageInGroup(): boolean {
        return !this.previousGroupMessage;
    }

    public GetText(): string | null {
        return this.text;
    }
}