import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { DivisionSelectorComponent } from 'src/app/components/division/division-selector/division-selector.component';
import { EmployeeSelectorComponent } from 'src/app/components/employees/employee-selector/employee-selector.component';
import { ProjectStageReportCreatorComponent } from 'src/app/components/projectStage/project-stage-report-creator/project-stage-report-creator.component';
import { ProjectStageReportDetailsComponent } from 'src/app/components/projectStage/project-stage-report-details/project-stage-report-details.component';
import { Division } from 'src/app/models/Division/Division';
import { DivisionContractor } from 'src/app/models/DivisionContractor/DivisionContractor';
import { Employee } from 'src/app/models/Employees/Employee';
import { ProjectStage } from 'src/app/models/ProjectStage/ProjectStage';
import { StageManager } from 'src/app/models/StageManager/StageManager';
import { StageReport } from 'src/app/models/StageReport/StageReport';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { AccessService } from 'src/app/services/access.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DivisionContractorService } from 'src/app/services/division-contractor.service';
import { ProjectStageService } from 'src/app/services/project-stage.service';
import { StageManagerService } from 'src/app/services/stage-manager.service';
import { StageReportService } from 'src/app/services/stage-report.service';

@Component({
  selector: 'app-project-stage-details-page',
  templateUrl: './project-stage-details-page.component.html',
  styleUrls: ['./project-stage-details-page.component.css']
})
export class ProjectStageDetailsPageComponent extends ComponentWithAccessSegregation {
  private readonly projectStageId: string;
  public projectStageHeader: string = 'Загрузка...';
  public projectName: string = "";
  public projectStage: ProjectStage = new ProjectStage();
  public isProjectStageUpdating: boolean = false;

  constructor(
    private projectStageService: ProjectStageService,
    private divisionContractorService: DivisionContractorService,
    protected override accessService: AccessService,
    private stageManagerService: StageManagerService,
    private stageReportService: StageReportService,
    private authService: AuthenticationService,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private dialog: MatDialog,
    private router: Router,
  ) {
    super(accessService);
    this.projectStageId = activateRoute.snapshot.params['projectStageId'];
    this.GetProjectNameOfProjectStage();
    this.PopulateProjectStageDetails();
  }

  public SaveButtonPressed() {
    this.isProjectStageUpdating = true;
    this.projectStageService.Update(this.projectStage)
      .subscribe({
        next: (response: ApiResponseSuccessfullUpdate) => {
          this.projectStage.updatedByUser = response.updatedByUser;
          this.projectStage.updatedOn = response.updatedOn;
          this.projectStageHeader = this.projectStage.name;
          this.isProjectStageUpdating = false;
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
          this.isProjectStageUpdating = false;
        }
      })
  }

  public BackPageClick() {
    this.router.navigate(['Projects/Details', this.projectStage.projectId, 'Stages']);
  }

  public AddProjectStageReport() {
    const dialogFormRef = this.dialog.open(ProjectStageReportCreatorComponent, {
      data: this.projectStage.id
    });
    dialogFormRef.afterClosed().subscribe({
      next: (createdReport: StageReport) => {
        if (createdReport) {
          this.projectStage.stageReports.unshift(createdReport);
        }
      },
    });
  }

  public AddProjectStageManager() {
    const dialogFormRef = this.dialog.open(EmployeeSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedEmployee: Employee) => {
        if (selectedEmployee) {
          if (this.projectStage.stageManagers.find(stageManager => stageManager.employeeId === selectedEmployee.id)) {
            this.snackBar.open(
              `"${selectedEmployee.GetLastNameAndInitials()}" уже является ответственным лицом`,
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-error']
              });
            return;
          }
          let stageManager = new StageManager();
          stageManager.employeeId = selectedEmployee.id;
          stageManager.projectStageId = this.projectStage.id;
          stageManager.employee = selectedEmployee;

          this.stageManagerService.Create(stageManager)
            .subscribe({
              next: (response: ApiResponseSuccessfullCreate) => {
                Object.assign(stageManager, response);
                this.projectStage.stageManagers.unshift(stageManager);
              }
            });
        }
      },
    });
  }

  public AddProjectStageContractor() {
    const dialogFormRef = this.dialog.open(DivisionSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedDivision: Division) => {
        if (selectedDivision) {
          if (this.projectStage.contractors.find(contractor => contractor.divisionId === selectedDivision.id)) {
            this.snackBar.open(
              `"${selectedDivision.name}" уже является исполнителем`,
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-error']
              });
            return;
          }
          let divContractor = new DivisionContractor();
          divContractor.divisionId = selectedDivision.id;
          divContractor.division = selectedDivision;
          divContractor.projectStageId = this.projectStage.id;
          this.divisionContractorService.Create(divContractor)
            .subscribe({
              next: (response: ApiResponseSuccessfullCreate) => {
                Object.assign(divContractor, response);
                this.projectStage.contractors.unshift(divContractor);
              }
            });
        }
      },
    });
  }

  public DeleteContractor(contractor: DivisionContractor) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить исполнителя "${contractor.division?.name}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.divisionContractorService.Delete(contractor.id)
            .subscribe({
              next: () => {
                this.projectStage.contractors = this.projectStage.contractors.filter((d: DivisionContractor) => d.id != contractor.id);
                this.snackBar.open(
                  "Исполнитель удалён",
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

  public DeleteStageManager(stageManager: StageManager) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите открепить "${stageManager.employee?.GetLastNameAndInitials()}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.stageManagerService.Delete(stageManager.id)
            .subscribe({
              next: () => {
                this.projectStage.stageManagers = this.projectStage.stageManagers.filter((sm: StageManager) => sm.id != stageManager.id);
                this.snackBar.open(
                  `${stageManager.employee?.GetLastNameAndInitials()} откреплён`,
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

  public DeleteReport(reportToDelete: StageReport) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить отчёт "${reportToDelete.name}"?`;
    confirmData.subContent = `(ВНИМАНИЕ: Будут удалены все прикреплённые файлы (${reportToDelete.attachedFiles.length}))`
    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.stageReportService.Delete(reportToDelete.id)
            .subscribe({
              next: () => {
                this.projectStage.stageReports = this.projectStage.stageReports.filter((sr: StageReport) => sr.id != reportToDelete.id);
                this.snackBar.open(
                  `${reportToDelete.name} удалён`,
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

  public OpenStageReportDetails(report: StageReport) {
    const dialogFormRef = this.dialog.open(ProjectStageReportDetailsComponent, {
      data: report
    });
  }

  private PopulateProjectStageDetails() {
    this.projectStageService.Get(this.projectStageId)
      .subscribe({
        next: (response: ProjectStage) => {
          this.projectStage = new ProjectStage(response);
          this.projectStageHeader = this.projectStage.name;
          this.titleService.setTitle(this.projectStageHeader + ' - Этапы');
        }
      })
  }

  private GetProjectNameOfProjectStage() {
    this.projectStageService.GetProjectName(this.projectStageId)
      .subscribe({
        next: (response: any) => {
          this.projectName = response.name;          
        }
      })
  }
}
