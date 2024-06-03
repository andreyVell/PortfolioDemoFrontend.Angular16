import { EntityBase } from "../_ApiBase/EntityBase";
import { EntityAction } from "./EntityAction";

export class AvetonRoleAccess extends EntityBase {
    entityName: string = '';
    entityAction: EntityAction = 0;
    isAllowed: boolean = false;
}