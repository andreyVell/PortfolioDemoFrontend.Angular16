import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientProjectStageReportDetailsComponent } from 'src/app/components/client-view/client-project-stage-report-details/client-project-stage-report-details.component';
import { ProjectStage } from 'src/app/models/ProjectStage/ProjectStage';
import { StageReport } from 'src/app/models/StageReport/StageReport';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { ClientViewService } from 'src/app/services/client-view.service';

@Component({
  selector: 'app-client-view-project-stage-details-page',
  templateUrl: './client-view-project-stage-details-page.component.html',
  styleUrls: ['./client-view-project-stage-details-page.component.css']
})
export class ClientViewProjectStageDetailsComponent extends AdaptiveComponent {
  private readonly projectStageId: string;
  public projectStageHeader: string = 'Загрузка...';
  public projectName: string = "Загрузка...";
  public projectStage: ProjectStage = new ProjectStage();

  constructor(
    private clientViewService: ClientViewService,
    private activateRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private titleService: Title,
    private dialog: MatDialog,
    private router: Router,
  ) {
    super();
    this.projectStageId = activateRoute.snapshot.params['projectStageId'];
    this.GetProjectNameOfProjectStage();
    this.PopulateProjectStageDetails();
  }

  public BackPageClick() {
    this.router.navigate(['ClientView/Project/Details', this.projectStage.projectId, 'Stages']);
  }

  public OpenStageReportDetails(report: StageReport) {
    const dialogFormRef = this.dialog.open(ClientProjectStageReportDetailsComponent, {
      data: report
    });
  }

  private PopulateProjectStageDetails() {
    this.clientViewService.GetProjectStageDetails(this.projectStageId)
      .subscribe({
        next: (response: ProjectStage) => {
          this.projectStage = new ProjectStage(response);
          this.projectStageHeader = this.projectStage.name;
          this.titleService.setTitle(this.projectStageHeader + ' - Этапы');
        }
      })
  }

  private GetProjectNameOfProjectStage() {
    this.clientViewService.GetProjectNameForStage(this.projectStageId)
      .subscribe({
        next: (response: any) => {
          if (response.name && response.name.length > 40) {
            this.projectName = (response.name as string).substring(0, 40) + '...';
          }
          else {
            this.projectName = response.name;
          }
        }
      })
  }
}
