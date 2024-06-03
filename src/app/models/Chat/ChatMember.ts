import { Organization } from "../Client/Organization";
import { Person } from "../Client/Person";
import { Employee } from "../Employees/Employee";
import { AttachFileModel } from "../_ApiBase/AttachFileModel";
import { EntityBase } from "../_ApiBase/EntityBase";
import { ChatMemberType } from "./ChatMemberType";

export class ChatMember extends EntityBase {
    public chatId: string | null = null;
    public type: ChatMemberType = 0;
    public employeeId: string | null = null;
    public personClientId: string | null = null;
    public organizationClientId: string | null = null;
    public employee: Employee | null = null;
    public personClient: Person | null = null;
    public organizationClient: Organization | null = null;
    public avatar: AttachFileModel | null = null;
    public isDeleting: boolean = false;

    constructor(init?: Partial<ChatMember>) {
        super();
        Object.assign(this, init);
        if (this.employee) {
            this.employee = new Employee(this.employee);
        }
        if (this.personClient) {
            this.personClient = new Person(this.personClient);
        }
        if (this.organizationClient) {
            this.organizationClient = new Organization(this.organizationClient);
        }
    }

    public GetDisplayName(): string {
        switch (this.type) {
            case ChatMemberType.Employee: {
                return this.employee?.GetFullName() ?? '';
            }
            case ChatMemberType.OrganizationClient: {
                return this.organizationClient?.GetFullName() ?? '';
            }
            case ChatMemberType.PersonClient: {
                return this.personClient?.GetFullName() ?? '';
            }
        }
    }

    public GetShortDisplayName(): string {
        switch (this.type) {
            case ChatMemberType.Employee: {
                return this.employee?.GetFirstNameAndLastName() ?? '';
            }
            case ChatMemberType.OrganizationClient: {
                return this.organizationClient?.GetShortName() ?? '';
            }
            case ChatMemberType.PersonClient: {
                return this.personClient?.GetFirstNameAndLastName() ?? '';
            }
        }
    }
    public GetOnlyName(): string {
        switch (this.type) {
            case ChatMemberType.Employee: {
                return this.employee?.firstName ?? '';
            }
            case ChatMemberType.OrganizationClient: {
                return this.organizationClient?.GetShortName() ?? '';
            }
            case ChatMemberType.PersonClient: {
                return this.personClient?.firstName ?? '';
            }
        }
    }
}