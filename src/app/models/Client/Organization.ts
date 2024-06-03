import { EntityBase } from "../_ApiBase/EntityBase";

export class Organization extends EntityBase {
    name: string = '';
    inn: string = '';
    contactEmail: string = '';
    contactPhone: string = '';
    login: string = '';
    password: string = '';

    constructor(init?: Partial<Organization>) {
        super();
        Object.assign(this, init);
    }

    public GetShortName(): string {
        return this.name;
    }

    public GetFullName(): string {
        return this.name;
    }

    public GetFullNameAndContacts(): string {
        let fullName: string = this.name;
        if (this.contactEmail || this.contactPhone) {
            fullName += ' (';
            if (this.contactEmail) {
                fullName += `Email: ${this.contactEmail}`;
            }
            if (this.contactPhone) {
                if (this.contactEmail) {
                    fullName += ', ';
                }
                fullName += `тел: ${this.contactPhone}`;
            }
            fullName += ')';
        }
        return fullName;
    }
}