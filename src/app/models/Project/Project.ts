import { Client } from "../Client/Client";
import { Division } from "../Division/Division";
import { Employee } from "../Employees/Employee";
import { EntityBase } from "../_ApiBase/EntityBase";

export class Project extends EntityBase {
    public name: string = '';
    public description: string | null = null;
    public managerId: string | null = null;
    public manager: Employee | null = null;
    public currentProgress: number = -1;
    public clients: Array<Client> = [];
    public contractors: Array<Division> = [];

    constructor(init?: Partial<Project>) {
        super();
        Object.assign(this, init);
        if (this.manager) {
            this.manager = new Employee(this.manager);
        }
        if (this.clients) {
            this.clients = this.clients.map(c => new Client(c));
        }
        if (this.contractors) {
            this.contractors = this.contractors.map(c => new Division(c));
        }
    }

    public GetClientsFullString(): string {
        let clientsNamesString = "";
        this.clients.forEach(c => {
            clientsNamesString += c.GetClientShortName() + '\n\t';
        });
        return clientsNamesString;
    }

    public GetContractorsFullString(): string {
        let contractorsNamesString = "";
        this.contractors.forEach(d => {
            contractorsNamesString += d.name + '\n\t';
        });
        return contractorsNamesString;
    }
}