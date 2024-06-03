import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvetonRole } from 'src/app/models/AvetonRole/AvetonRole';
import { AvetonUser } from 'src/app/models/AvetonUser/AvetonUser';
import { NewAvetonUserRequest } from 'src/app/models/AvetonUser/NewAvetonUserRequest';
import { Employee } from 'src/app/models/Employees/Employee';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { AvetonUserService } from 'src/app/services/aveton-user.service';
import { ConfirmationDialogComponent } from '../../_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { AvetonRoleSelectorComponent } from '../../aveton-role/aveton-role-selector/aveton-role-selector.component';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-employee-roles',
  templateUrl: './employee-roles.component.html',
  styleUrls: ['./employee-roles.component.css']
})
export class EmployeeRolesComponent extends ComponentWithAccessSegregation implements OnInit {
  @Input() employee!: Employee;
  public credentialsFormVisable: boolean = false;
  public avetonUserRequest: NewAvetonUserRequest = new NewAvetonUserRequest();
  public isCredentialsProcessing: boolean = false;

  constructor(
    protected override accessService: AccessService,
    private avetonUserService: AvetonUserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    super(accessService);    
  }
  public ngOnInit(): void {
    this.avetonUserRequest.employeeId = this.employee.id;
    this.avetonUserRequest.login = this.employee.credentials?.login ?? '';
    this.avetonUserRequest.password = '';
  }

  public OpenNewUserForm() {
    this.credentialsFormVisable = true;
    this.avetonUserRequest.employeeId = this.employee.id;
    this.avetonUserRequest.login = this.employee.email ?? '';
    this.avetonUserRequest.password = this.employee.mobilePhoneNumber ?? '';
  }

  public CreateUpdateNewUser() {
    this.isCredentialsProcessing = true;
    if (this.employee.credentialsId && this.employee.credentials) {
      //update       
      this.employee.credentials.login = this.avetonUserRequest.login;
      this.employee.credentials.password = this.avetonUserRequest.password;
      this.avetonUserService.Update(this.employee.credentials)
        .subscribe({
          next: (response: ApiResponseSuccessfullCreate) => {
            this.employee.credentialsId = response.id;
            this.employee.credentials = new AvetonUser();
            this.employee.credentials.id = response.id;
            this.employee.credentials.createdOn = response.createdOn;
            this.employee.credentials.updatedOn = response.updatedOn;
            this.PopulateRoles();
            this.isCredentialsProcessing = false;
            this.snackBar.open(
              "Информация обновлена",
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-success']
              });
          },
          error: (err: any) => {
            this.isCredentialsProcessing = false;
          }
        })
    }
    else {
      //create
      this.avetonUserService.Create(this.avetonUserRequest)
        .subscribe({
          next: (response: ApiResponseSuccessfullCreate) => {
            this.employee.credentialsId = response.id;
            this.employee.credentials = new AvetonUser();
            this.employee.credentials.id = response.id;
            this.employee.credentials.createdOn = response.createdOn;
            this.employee.credentials.updatedOn = response.updatedOn;
            this.employee.credentials.login = this.avetonUserRequest.login;
            this.employee.credentials.password = this.avetonUserRequest.password;
            this.PopulateRoles();
            this.isCredentialsProcessing = false;
            this.snackBar.open(
              "Информация обновлена",
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-success']
              });
          },
          error: (err: any) => {
            this.isCredentialsProcessing = false;
          }
        })
    }
  }

  public DeleteRole(roleToDelete: AvetonRole) {
    if (this.employee.credentialsId) {
      let confirmData = new ConfirmData();
      confirmData.title = 'Внимание';
      confirmData.content = `Вы уверены что хотите открепить роль "${roleToDelete.name}" от пользователя ${this.employee.GetLastNameAndInitials()}?`;

      const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
        data: confirmData,
      });
      dialogFormRef.afterClosed().subscribe({
        next: (answer: any) => {
          if (answer) {
            this.avetonUserService.DeleteRole(roleToDelete.id, this.employee.credentialsId!)
              .subscribe({
                next: () => {
                  this.employee.roles = this.employee.roles.filter(role => role.id != roleToDelete.id);
                  this.snackBar.open(
                    "Роль откреплена",
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

  public PopulateRoles() {
    if (this.employee.credentialsId) {
      this.avetonUserService.GetAllRoles(this.employee.credentialsId!)
        .subscribe({
          next: (response: ItemsCollectionResponce<AvetonRole>) => {
            this.employee.roles = response.items;
          }
        })
    }
  }

  public AddRole() {
    const dialogFormRef = this.dialog.open(AvetonRoleSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedRole: AvetonRole) => {
        if (selectedRole) {
          this.avetonUserService.AddSelectedRoleToUser(selectedRole.id, this.employee.credentialsId!)
            .subscribe({
              next: () => {
                this.employee.roles.unshift(selectedRole);
                this.snackBar.open(
                  "Роль добавлена",
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
