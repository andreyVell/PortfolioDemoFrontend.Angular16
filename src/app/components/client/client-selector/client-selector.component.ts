import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientType } from 'src/app/models/Client/ClientType';
import { Organization } from 'src/app/models/Client/Organization';
import { Person } from 'src/app/models/Client/Person';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { OrganizationService } from 'src/app/services/organization.service';
import { PersonService } from 'src/app/services/person.service';
import { PersonCreatorComponent } from '../person-creator/person-creator.component';
import { OrganizationCreatorComponent } from '../organization-creator/organization-creator.component';
import { Client } from 'src/app/models/Client/Client';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-client-selector',
  templateUrl: './client-selector.component.html',
  styleUrls: ['./client-selector.component.css']
})
export class ClientSelectorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  persons: Array<Person> = [];
  organizations: Array<Organization> = [];
  displayMode: ClientType = ClientType.Person;

  constructor(
    private personService: PersonService,
    private organizationService: OrganizationService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private dialogRef: MatDialogRef<ClientSelectorComponent>) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh() {
    switch (this.displayMode) {
      case ClientType.Person: {
        this.PopulatePersons();
        break;
      }
      case ClientType.Organization: {
        this.PopulateOrganizations();
        break;
      }
    }
  }

  public CreateClient() {
    switch (this.displayMode) {
      case ClientType.Person: {
        this.CreatePerson();
        break;
      }
      case ClientType.Organization: {
        this.CreateOrganization();
        break;
      }
    }
  }


  public CloseForm() {
    this.dialogRef.close(false);
  }

  public ClientSelected(selectedClient: Person | Organization) {
    let client = new Client();
    client.clientType = this.displayMode;
    switch (this.displayMode) {
      case ClientType.Person: {
        client.person = selectedClient as Person;
        client.personId = selectedClient.id;
        break;
      }
      case ClientType.Organization: {
        client.organization = selectedClient as Organization;
        client.organizationId = selectedClient.id;
        break;
      }
    }
    this.dialogRef.close(client);
  }

  private PopulatePersons() {
    this.personService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Person>) => {
          this.persons = response.items
            .map(person => new Person(person))
            .sort((a, b) => (a.GetFullName() > b.GetFullName()) ? 1 : ((b.GetFullName() > a.GetFullName()) ? -1 : 0));
          this.pageSettings.totalItems = response.totalItems;
        }
      });
  }

  private PopulateOrganizations() {
    this.organizationService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Organization>) => {
          this.organizations = response.items
            .map(organization => new Organization(organization))
            .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));;
          this.pageSettings.totalItems = response.totalItems;
        }
      });
  }

  private CreatePerson() {
    const dialogFormRef = this.dialog.open(PersonCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdPerson: Person) => {
        if (createdPerson) {
          this.persons.unshift(createdPerson);
          this.pageSettings.totalItems++;
          if (this.persons.length >= this.pageSettings.itemsPerPage) {
            this.persons.pop();
          }
        }
      }
    });
  }

  private CreateOrganization() {
    const dialogFormRef = this.dialog.open(OrganizationCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdOrganization: Organization) => {
        if (createdOrganization) {
          this.organizations.unshift(createdOrganization);
          this.pageSettings.totalItems++;
          if (this.organizations.length >= this.pageSettings.itemsPerPage) {
            this.organizations.pop();
          }
        }
      }
    });
  }
}
