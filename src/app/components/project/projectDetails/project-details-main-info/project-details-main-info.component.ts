import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientSelectorComponent } from 'src/app/components/client/client-selector/client-selector.component';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeSelectorComponent } from 'src/app/components/employees/employee-selector/employee-selector.component';
import { Client } from 'src/app/models/Client/Client';
import { Employee } from 'src/app/models/Employees/Employee';
import { Project } from 'src/app/models/Project/Project';
import { ProjectStage } from 'src/app/models/ProjectStage/ProjectStage';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { AccessService } from 'src/app/services/access.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-project-details-main-info',
  templateUrl: './project-details-main-info.component.html',
  styleUrls: ['./project-details-main-info.component.css']
})
export class ProjectDetailsMainInfoComponent extends ComponentWithAccessSegregation {
  @Input() project: Project = new Project();
  @Input() isProjectUpdating!: boolean;
  @Output() saveButtonPressed: EventEmitter<void> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private clientService: ClientService,
    protected override accessService: AccessService,
  ) {
    super(accessService);
  }

  public SaveProject() {
    this.saveButtonPressed.emit();
  }

  public SelectManager() {
    const dialogFormRef = this.dialog.open(EmployeeSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedEmployee: Employee) => {
        if (selectedEmployee) {
          this.project.managerId = selectedEmployee.id;
          this.project.manager = selectedEmployee;
        }
      },
    });
  }

  public AddClient() {
    const dialogFormRef = this.dialog.open(ClientSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedClient: Client) => {
        if (selectedClient) {
          selectedClient.projectId = this.project.id;
          if (this.project.clients.find(c => {
            if (c.personId) {
              return c.personId === selectedClient.personId;
            }
            if (c.organizationId) {
              return c.organizationId === selectedClient.organizationId;
            }
            return false;
          })) {
            this.snackBar.open(
              "Данный заказчик уже выбран",
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-error']
              });
            return;
          }
          this.clientService.Create(selectedClient)
            .subscribe({
              next: (val: ApiResponseSuccessfullCreate) => {
                Object.assign(selectedClient, val);
                this.project.clients.unshift(selectedClient);
                this.snackBar.open(
                  "Заказчик добавлен",
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

  public DeleteClient(clientToDelete: Client) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить заказчика "${clientToDelete.GetClientFullName()}"`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.clientService.Delete(clientToDelete.id)
            .subscribe({
              next: () => {
                this.project.clients = this.project.clients.filter(client => client.id != clientToDelete.id);
                this.snackBar.open(
                  "Заказчик удалён",
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
