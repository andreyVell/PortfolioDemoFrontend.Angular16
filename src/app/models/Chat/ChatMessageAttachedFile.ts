import { AttachFileModel } from "../_ApiBase/AttachFileModel";
import { EntityAttachedFile } from "../_ApiBase/EntityAttachedFile";

export class ChatMessageAttachedFile extends EntityAttachedFile {
    public chatId: string = '';
    public messageId: string = '';    

    constructor(init?: Partial<ChatMessageAttachedFile>, fileContent: AttachFileModel | null = null) {
        super(init, fileContent);
        this.chatId = init?.chatId ?? '';
        this.messageId = init?.messageId ?? '';
    }
}