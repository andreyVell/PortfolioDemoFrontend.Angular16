import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/Employees/Employee';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { AccessService } from 'src/app/services/access.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { JobService } from 'src/app/services/job.service';
import { WrapperForValueType } from 'src/app/models/_ApiBase/WrapperForValueType';
import { FormatHelper } from 'src/app/helpers/FormatHelper';

@Component({
  selector: 'app-employee-details-page',
  templateUrl: './employee-details-page.component.html',
  styleUrls: ['./employee-details-page.component.css']
})
export class EmployeeDetailsPageComponent extends ComponentWithAccessSegregation {
  private readonly employeeId: string;
  public employee: Employee = new Employee();
  public defaultImageSrc: string = 'assets/images/default.png';
  public isJobUpdating: boolean = false;
  public isEmployeeUpdating: WrapperForValueType<boolean> = new WrapperForValueType(false);

  constructor(
    private employeeService: EmployeesService,
    protected override accessService: AccessService,
    private jobService: JobService,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private location: Location
  ) {
    super(accessService);
    this.employeeId = activateRoute.snapshot.params['employeeId'];
    this.PopulateEmployee();
  }

  public BackPageClick() {
    this.location.back();
  }

  public SaveEmployee() {
    this.isEmployeeUpdating.value = true;
    this.isJobUpdating = true;
    this.SaveEmployeeLastJob();
    this.employeeService.Update(this.employee)
      .subscribe({
        next: (response: ApiResponseSuccessfullUpdate) => {
          this.employee.updatedOn = response.updatedOn;
          this.employee.updatedByUser = response.updatedByUser;
          this.titleService.setTitle(this.employee.GetLastNameAndInitials() + ' - Сотрудники');
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
        },
        error: (response: any) => {
          this.isEmployeeUpdating.value = false;
        }
      })
  }

  public ProcessStudentAvatar(imageInput: HTMLInputElement) {
    FormatHelper.ProcessFilesFromInput(imageInput, this.isEmployeeUpdating, this.snackBar, this.setProcessedAvatar.bind(this));
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
    this.employeeService.Get(this.employeeId)
      .subscribe({
        next: (response: Employee) => {
          this.employee = new Employee(response);
          this.titleService.setTitle(this.employee.GetLastNameAndInitials() + ' - Сотрудники');
        }
      })
  }

  private setProcessedAvatar(processedAvatar: AttachFileModel) {
    this.employee.employeeAvatar = processedAvatar;
  }
}
