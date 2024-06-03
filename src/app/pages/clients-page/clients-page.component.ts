import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationCreatorComponent } from 'src/app/components/client/organization-creator/organization-creator.component';
import { OrganizationEditorComponent } from 'src/app/components/client/organization-editor/organization-editor.component';
import { PersonCreatorComponent } from 'src/app/components/client/person-creator/person-creator.component';
import { PersonEditorComponent } from 'src/app/components/client/person-editor/person-editor.component';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { ClientType } from 'src/app/models/Client/ClientType';
import { Organization } from 'src/app/models/Client/Organization';
import { Person } from 'src/app/models/Client/Person';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AccessService } from 'src/app/services/access.service';
import { OrganizationService } from 'src/app/services/organization.service';
import { PersonService } from 'src/app/services/person.service';
import { Client } from '../../models/Client/Client';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.css']
})
export class ClientsPageComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  persons: Array<Person> = [];
  organizations: Array<Organization> = [];
  displayMode: ClientType | undefined = undefined;

  constructor(
    protected override accessService: AccessService,
    private personService: PersonService,
    private organizationService: OrganizationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super(accessService);
    if (this.HasReadAccessTo('Person')) {
      this.displayMode = ClientType.Person;
    }
    else {
      this.displayMode = ClientType.Organization;
    }
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

  public OpenClientDetailsPage(client: Person | Organization) {
    if (client instanceof Organization) {
      this.OpenOrganizationDetails(client);
    }
    if (client instanceof Person) {
      this.OpenPersonDetails(client);
    }
  }

  public DeleteClient(client: Person | Organization) {
    if (client instanceof Organization) {
      this.DeleteOrganization(client);
    }
    if (client instanceof Person) {
      this.DeletePerson(client);
    }
  }

  private PopulatePersons() {
    this.personService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Person>) => {
          this.persons = response.items
            .map(person => new Person(person))
            .sort((a, b) => (a.GetFullName() > b.GetFullName()) ? 1 : ((b.GetFullName() > a.GetFullName()) ? -1 : 0));;
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

  private OpenPersonDetails(person: Person) {
    const dialogFormRef = this.dialog.open(PersonEditorComponent, {
      data: person
    });
  }

  private OpenOrganizationDetails(organization: Organization) {
    const dialogFormRef = this.dialog.open(OrganizationEditorComponent, {
      data: organization
    });
  }

  private DeletePerson(person: Person) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить клиента "${person.GetFullName()}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.personService.Delete(person.id)
            .subscribe({
              next: () => {
                this.persons = this.persons.filter((p: Person) => p.id != person.id);
                this.pageSettings.totalItems--;
                this.snackBar.open(
                  "Клиент удалён",
                  "Ок",
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 4000,
                    panelClass: ['snack-bar-success']
                  });
              }
            })
        }
      },
    });
  }

  private DeleteOrganization(organization: Organization) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить организацию "${organization.name}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.organizationService.Delete(organization.id)
            .subscribe({
              next: () => {
                this.organizations = this.organizations.filter((o: Organization) => o.id != organization.id);
                this.pageSettings.totalItems--;
                this.snackBar.open(
                  "Организация удалена",
                  "Ок",
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 4000,
                    panelClass: ['snack-bar-success']
                  });
              }
            })
        }
      },
    });
  }
}
