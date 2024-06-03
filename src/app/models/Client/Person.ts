import { EntityBase } from "../_ApiBase/EntityBase";

export class Person extends EntityBase {
    firstName: string = '';
    lastName: string = '';
    secondName: string = '';
    contactEmail: string = '';
    contactPhone: string = '';
    login: string = '';
    password: string = '';

    constructor(init?: Partial<Person>) {
        super();
        Object.assign(this, init);
    }


    public GetFullName(): string {
        return `${this.lastName} ${this.firstName} ${this.secondName}`;
    }

    public GetLastNameAndFirstName(): string {
        return `${this.lastName} ${this.firstName}`;
    }

    public GetFirstNameAndLastName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public GetLastNameAndInitials(): string {
        let result: string = '';
        if (!this.lastName) return result;
        result += this.lastName;
        if (this.firstName) {
            result += ' ' + this.firstName?.substring(0, 1) + '.';
        }
        if (this.secondName) {
            result += ' ' + this.secondName?.substring(0, 1) + '.';
        }
        return result;
    }
    public GetFullNameAndContacts(): string {
        let fullName: string = `${this.lastName} ${this.firstName} ${this.secondName}`;
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