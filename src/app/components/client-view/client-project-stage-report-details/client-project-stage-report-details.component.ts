import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StageReport } from 'src/app/models/StageReport/StageReport';
import { ProjectStageReportDetailsComponent } from '../../projectStage/project-stage-report-details/project-stage-report-details.component';
import { StageReportAttachedFile } from 'src/app/models/StageReportAttachedFile/StageReportAttachedFile';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { ClientViewService } from 'src/app/services/client-view.service';
import { EntityAttachedFile } from 'src/app/models/_ApiBase/EntityAttachedFile';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';

@Component({
  selector: 'app-client-project-stage-report-details',
  templateUrl: './client-project-stage-report-details.component.html',
  styleUrls: ['./client-project-stage-report-details.component.css']
})
export class ClientProjectStageReportDetailsComponent extends AdaptiveComponent {
  public stageReport: StageReport = new StageReport();
  stageReportForm!: FormGroup;

  constructor(
    private clientViewService: ClientViewService,    
    private dialogRef: MatDialogRef<ProjectStageReportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StageReport) {
    super();
    this.stageReport = data;
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public DownloadFileContent(file: EntityAttachedFile) {
    this.clientViewService.GetStageReportAttachedFileContent(file.id, false).subscribe({
      next: (val: AttachFileModel) => {
        if (val) {
          if (val.fileContent) {
            let link = document.createElement('a');
            link.href = val.fileContent;
            link.download = val.fileName ?? "";
            link.click();
          }
        }
      }
    });
  }

  public GetImageMediumContent(image: EntityAttachedFile) {
    image.mediumImage.isFileContentProcessing = true;
    this.clientViewService.GetStageReportAttachedFileContent(image.id, true).subscribe({
      next: (response: AttachFileModel) => {
        if (response) {
          image.mediumImage = new AttachFileModel(response);
          image.mediumImage.isFileContentProcessing = false;
        }
      }
    });
  }

  public GetImageFullContent(image: EntityAttachedFile) {
    image.fileContent.isFileContentProcessing = true;
    this.clientViewService.GetStageReportAttachedFileContent(image.id, false).subscribe({
      next: (response: AttachFileModel) => {
        if (response) {
          image.fileContent = new AttachFileModel(response);
          image.fileContent.isFileContentProcessing = false;
        }
      }
    });
  }
}
