import { AttachFileModel } from "../_ApiBase/AttachFileModel";
import { EntityBase } from "../_ApiBase/EntityBase";
import { Chat } from "./Chat";

export class UpdateChatRequest extends EntityBase {
    public name: string = '';
    public NewAvatar: AttachFileModel | null = null;

    constructor(init: Partial<Chat>, newAvatar: AttachFileModel | null = null) {
        super();
        this.id = init.id ?? '';
        this.createdByUser = init.createdByUser ?? '';
        this.updatedByUser = init.updatedByUser ?? '';
        this.createdOn = init.createdOn ?? new Date();
        this.updatedOn = init.updatedOn ?? new Date();
        this.name = init?.name ?? '';
        this.NewAvatar = newAvatar;
    }
}