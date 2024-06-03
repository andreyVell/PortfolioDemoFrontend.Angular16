import { FormatHelper } from "src/app/helpers/FormatHelper";
import { AttachFileModel } from "../_ApiBase/AttachFileModel";

export class CreateStageReport {
    public reportDate: Date = new Date();
    public content: string | null = null;
    public name: string | null = null;
    public projectStageId: string | null = null;

    public attachedFiles: Array<AttachFileModel> = [];

    constructor(init?: Partial<CreateStageReport>) {
        Object.assign(this, init);
        if (this.reportDate) {
            this.reportDate = new Date(this.reportDate);
        }
        if (!this.name) {
            this.name = "Отчёт от " + FormatHelper.DateToShortString(this.reportDate);
        }
        if (this.attachedFiles) {
            this.attachedFiles = this.attachedFiles.map(af => new AttachFileModel(af));
        }
    }
}