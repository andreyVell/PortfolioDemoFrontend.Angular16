import { combineLatest } from "rxjs";
import { DivisionContractor } from "../DivisionContractor/DivisionContractor";
import { StageManager } from "../StageManager/StageManager";
import { StageReport } from "../StageReport/StageReport";
import { EntityBase } from "../_ApiBase/EntityBase";
import { CompletionStatus } from "./ProjectStageCompletionStatus";

export class ProjectStage extends EntityBase {
    public name: string = '';
    public description: string | null = null;
    public isCompleted: boolean = false;
    public projectId: string = '';
    public parentStageId: string | null = null;
    public orderNumber: number = 0;
    public childStages: Array<ProjectStage> = [];
    public stageManagers: Array<StageManager> = [];
    public contractors: Array<DivisionContractor> = [];
    public stageReports: Array<StageReport> = [];
    public currentProgress: number = -1;

    constructor(init?: Partial<ProjectStage>) {
        super();
        Object.assign(this, init);
        if (this.childStages) {
            this.childStages = this.childStages.map(cs => new ProjectStage(cs))
                .sort((a,b) => (a.orderNumber > b.orderNumber) ? 1 : ((b.orderNumber > a.orderNumber) ? -1 : 0));
        }
        if (this.stageManagers) {
            this.stageManagers = this.stageManagers.map(cm => new StageManager(cm));
        }
        if (this.contractors) {
            this.contractors = this.contractors.map(c => new DivisionContractor(c));
        }
        if (this.stageReports) {
            this.stageReports = this.stageReports.map(sr => new StageReport(sr))
                .sort((a, b) => (a.reportDate < b.reportDate) ? 1 : ((b.reportDate < a.reportDate) ? -1 : 0));
        }
    }
}