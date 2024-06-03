import { EntityBase } from "../_ApiBase/EntityBase";

export class Position extends EntityBase{
    name: string = '';
    constructor(init?: Partial<Position>) {
        super();
        Object.assign(this, init);        
    }
}