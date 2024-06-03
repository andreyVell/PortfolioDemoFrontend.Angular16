import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employees/Employee';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { AccessService } from 'src/app/services/access.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { JobService } from 'src/app/services/job.service';
import { CurrentUserDataService } from 'src/app/services/current-user-data.service';
import { WrapperForValueType } from 'src/app/models/_ApiBase/WrapperForValueType';
import { FormatHelper } from 'src/app/helpers/FormatHelper';

@Component({
  selector: 'app-personal-account-page',
  templateUrl: './personal-account-page.component.html',
  styleUrls: ['./personal-account-page.component.css']
})
export class PersonalAccountPageComponent extends ComponentWithAccessSegregation {
  public employee: Employee = new Employee();
  public defaultImageSrc: string = 'assets/images/default.png';
  public employeeAvatar: string | ArrayBuffer | null = null;
  public isJobUpdating: boolean = false;
  public isEmployeeUpdating: WrapperForValueType<boolean> = new WrapperForValueType(false);

  constructor(
    private employeeService: EmployeesService,
    protected override accessService: AccessService,
    private jobService: JobService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    private currentUserDataService: CurrentUserDataService
  ) {
    super(accessService);
    this.PopulateEmployee();
  }

  public MainPageClick() {
    this.location.back();
  }

  public async SaveEmployee() {
    this.isEmployeeUpdating.value = true;
    this.isJobUpdating = true;
    this.SaveEmployeeLastJob();
    this.employeeService.Update(this.employee)
      .subscribe({
        next: (response: ApiResponseSuccessfullUpdate) => {
          this.employee.updatedOn = response.updatedOn;
          this.employee.updatedByUser = response.updatedByUser;
          this.isEmployeeUpdating.value = false;
          this.snackBar.open(
            "Информация обновлена",
            "Ок",
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 4000,
              panelClass: ['snack-bar-success']
            });
          this.currentUserDataService.UpdateCurrentUserEmployeeShortInfo(this.employee);
        },
        error: (response: any) => {
          this.isEmployeeUpdating.value = false;
        }
      })
  }

  public async ProcessStudentAvatar(imageInput: any) {
    let processedFiles = FormatHelper.ProcessFilesFromInput(imageInput, this.isEmployeeUpdating, this.snackBar, this.setProcessedAvatar.bind(this));
    imageInput.value = '';
  }

  private SaveEmployeeLastJob() {
    if (this.employee.lastJob) {
      if (this.employee.lastJob.id) {
        this.jobService.Update(this.employee.lastJob).subscribe({
          next: (response: ApiResponseSuccessfullUpdate) => {
            this.employee.lastJob!.updatedOn = response.updatedOn;
            this.employee.lastJob!.updatedByUser = response.updatedByUser;
            this.isJobUpdating = false;
          },
          error: (response: any) => {
            this.isJobUpdating = false;
            this.snackBar.open(
              "Не удалось обновить данные о месте работы",
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-error']
              });
          }
        })
      }
      else {
        this.jobService.Create(this.employee.lastJob).subscribe({
          next: (response: ApiResponseSuccessfullCreate) => {
            this.employee.lastJob!.id = response.id;
            this.employee.lastJob!.createdByUser = response.createdByUser;
            this.employee.lastJob!.createdOn = response.createdOn;
            this.employee.lastJob!.updatedOn = response.updatedOn;
            this.employee.lastJob!.updatedByUser = response.updatedByUser;
            this.isJobUpdating = false;
          },
          error: (response: any) => {
            this.isJobUpdating = false;
            this.snackBar.open(
              "Не удалось обновить данные о месте работы",
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-success']
              });
          }
        });
      }
    }

  }

  private PopulateEmployee() {
    this.currentUserDataService.GetCurrentUserEmployee()
      .subscribe({
        next: (response: Employee) => {
          this.employee = new Employee(response);
        }
      })
  }

  private setProcessedAvatar(processedAvatar: AttachFileModel) {
    this.employee.employeeAvatar = processedAvatar;
  }
}
