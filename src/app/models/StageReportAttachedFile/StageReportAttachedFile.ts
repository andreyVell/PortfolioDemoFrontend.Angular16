import { EntityAttachedFile } from "../_ApiBase/EntityAttachedFile";

export class StageReportAttachedFile extends EntityAttachedFile {  
    public stageReportId: string | null = null;

    constructor(init?: Partial<StageReportAttachedFile>) {
        super(init);
        this.stageReportId = init?.stageReportId ?? null;    
    }
}