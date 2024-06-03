import { Division } from "../Division/Division";
import { EntityBase } from "../_ApiBase/EntityBase";

export class DivisionContractor extends EntityBase {
    projectStageId: string | null = null;
    divisionId: string | null = null;
    division: Division | null = null;

    constructor(init?: Partial<DivisionContractor>) {
        super();
        Object.assign(this, init);
        if (this.division) {
            this.division = new Division(this.division);
        }
    }
}