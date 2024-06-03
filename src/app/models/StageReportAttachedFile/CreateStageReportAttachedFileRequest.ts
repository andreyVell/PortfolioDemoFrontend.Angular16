import { AttachFileModel } from "../_ApiBase/AttachFileModel";

export class CreateStageReportAttachedFileRequest {   
    public file: AttachFileModel = new AttachFileModel();
    public stageReportId: string | null = null;

    constructor(init?: Partial<CreateStageReportAttachedFileRequest>) {
        Object.assign(this, init); 
    }
}