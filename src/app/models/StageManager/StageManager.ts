import { Employee } from "../Employees/Employee";
import { EntityBase } from "../_ApiBase/EntityBase";

export class StageManager extends EntityBase {
    public projectStageId: string | null = null;
    public employeeId: string | null = null;
    public employee: Employee | null = null;

    constructor(init?: Partial<StageManager>) {
        super();
        Object.assign(this, init);
        if (this.employee) {
            this.employee = new Employee(this.employee);
        }
    }
}