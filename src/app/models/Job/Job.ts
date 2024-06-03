import { EntityBase } from "../_ApiBase/EntityBase";

export class Job extends EntityBase {
    positionId: string | null = null;
    employeeId: string | null = null;
    divisionId: string | null = null;
    positionName: string | null = null;
    divisionName: string | null = null;
    startDate: Date | null = null;

    constructor(init?: Partial<Job>) {
        super();
        Object.assign(this, init);
        if (this.startDate) {
            this.startDate = new Date(this.startDate);
        }
    }
}