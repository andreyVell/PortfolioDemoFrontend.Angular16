import { EntityBase } from "../_ApiBase/EntityBase";
import { AvetonRoleAccess } from "./AvetonRoleAccess";

export class AvetonRole extends EntityBase {
    name: string = '';
    isDefault: boolean | null = null;
    isSystemAdministrator: boolean = false;
    accesses: Array<AvetonRoleAccess> = [];
}