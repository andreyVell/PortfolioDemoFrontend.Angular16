import { EntityBase } from "../_ApiBase/EntityBase";

export class ChatMessageViewedInfo extends EntityBase {
    public messageId: string = '';
    public viewedById: string = '';

    constructor(init?: Partial<ChatMessageViewedInfo>) {
        super();
        Object.assign(this, init);

    }
}