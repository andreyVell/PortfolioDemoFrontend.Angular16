import { StageManager } from "../StageManager/StageManager";
import { StageReportAttachedFile } from "../StageReportAttachedFile/StageReportAttachedFile";
import { EntityBase } from "../_ApiBase/EntityBase";

export class StageReport extends EntityBase {
    public reportDate: Date = new Date();
    public name: string | null = null;
    public content: string | null = null;
    public projectStageId: string | null = null;
    public stageManagerId: string | null = null;
    public employeeId: string | null = null;
    public stageManager: StageManager | null = null;
    public attachedFiles: Array<StageReportAttachedFile> = [];

    constructor(init?: Partial<StageReport>) {
        super();
        Object.assign(this, init);
        if (this.stageManager) {
            this.stageManager = new StageManager(this.stageManager);
        }
        if (this.reportDate) {
            this.reportDate = new Date(this.reportDate);
        }
        if (this.attachedFiles) {
            this.attachedFiles = this.attachedFiles.map(af => new StageReportAttachedFile(af));
        }
    }
}