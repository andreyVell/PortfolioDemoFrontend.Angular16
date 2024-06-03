import { AvetonRole } from "../AvetonRole/AvetonRole";
import { AvetonUser } from "../AvetonUser/AvetonUser";
import { Job } from "../Job/Job";
import { AttachFileModel } from "../_ApiBase/AttachFileModel";
import { EntityBase } from "../_ApiBase/EntityBase";

export class Employee extends EntityBase {
    firstName: string | null = null; //Имя
    lastName: string | null = null; //Фамилия
    secondName: string | null = null; //Отчество
    email: string | null = null;
    mobilePhoneNumber: string | null = null;
    birthday: Date | null = null;
    credentialsId: string | null = null;
    credentials: AvetonUser | null = null;
    employeeAvatar: AttachFileModel | null = null;
    employeeSmallAvatar: AttachFileModel | null = null;
    lastJob: Job | null = null;
    roles: Array<AvetonRole> = [];


    constructor(init?: Partial<Employee>) {
        super();
        Object.assign(this, init);
        if (this.birthday) {
            this.birthday = new Date(this.birthday);
        }
        if (!this.lastJob) {
            this.lastJob = new Job();
            this.lastJob.employeeId = this.id;
        }
        else {
            if (this.lastJob.startDate) {
                this.lastJob.startDate = new Date(this.lastJob.startDate);
            }
        }
        if (this.employeeAvatar){
            this.employeeAvatar = new AttachFileModel(this.employeeAvatar);
        }
        if (this.employeeSmallAvatar){
            this.employeeSmallAvatar = new AttachFileModel(this.employeeSmallAvatar);
        }
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

    public GetFirstNameAndLastNameInitial(): string {
        let result: string = '';
        if (!this.firstName) return result;
        result += this.firstName;
        if (this.lastName) {
            result += ' ' + this.lastName?.substring(0, 1) + '.';
        }        
        return result;
    }

    public GetFullNameAndContacts(): string {
        let fullName: string = `${this.lastName} ${this.firstName} ${this.secondName}`;
        if (this.email || this.mobilePhoneNumber) {
            fullName += ' (';
            if (this.email) {
                fullName += `Email: ${this.email}`;
            }
            if (this.mobilePhoneNumber) {
                if (this.email) {
                    fullName += ', ';
                }
                fullName += `тел: ${this.mobilePhoneNumber}`;
            }
            fullName += ')';
        }
        return fullName;
    }
}