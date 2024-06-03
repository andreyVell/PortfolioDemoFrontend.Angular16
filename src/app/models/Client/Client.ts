import { EntityBase } from "../_ApiBase/EntityBase";
import { ClientType } from "./ClientType";
import { Organization } from "./Organization";
import { Person } from "./Person";

export class Client extends EntityBase {
    public clientType: ClientType | null = null;
    public projectId: string = '';
    public personId: string | null = null;
    public organizationId: string | null = null;
    public person: Person | null = null;
    public organization: Organization | null = null;

    constructor(init?: Partial<Client>) {
        super();
        Object.assign(this, init);
        if (this.person) {
            this.person = new Person(this.person);
        }
        if (this.organization) {
            this.organization = new Organization(this.organization);
        }
    }

    public GetClientFullName(): string {
        switch (this.clientType) {
            case ClientType.Organization:
                return this.organization?.GetFullName() ?? '';
            case ClientType.Person:
                return this.person?.GetFullName() ?? '';
        }
        return "";
    }

    public GetClientShortName(): string {
        switch (this.clientType) {
            case ClientType.Organization:
                return this.organization?.GetShortName() ?? '';
            case ClientType.Person:
                return this.person?.GetLastNameAndInitials() ?? '';
        }
        return "";
    }
}