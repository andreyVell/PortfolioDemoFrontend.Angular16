import { EntityBase } from "../_ApiBase/EntityBase";

export class Division extends EntityBase {
    name: string = '';
    parentDivisionId: string | null = null;
    childDivisions?: Array<Division> = [];
    mouseOvered: boolean = false;

    constructor(init?: Partial<Division>) {
        super();
        Object.assign(this, init);
        if (this.childDivisions) {
            this.childDivisions = this.childDivisions.map(c => new Division(c));
        }
    }
}