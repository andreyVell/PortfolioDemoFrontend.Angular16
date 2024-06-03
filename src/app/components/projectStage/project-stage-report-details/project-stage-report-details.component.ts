import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { StageReport } from 'src/app/models/StageReport/StageReport';
import { CreateStageReportAttachedFileRequest } from 'src/app/models/StageReportAttachedFile/CreateStageReportAttachedFileRequest';
import { StageReportAttachedFile } from 'src/app/models/StageReportAttachedFile/StageReportAttachedFile';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { StageReportService } from 'src/app/services/stage-report.service';
import { ConfirmationDialogComponent } from '../../_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { StageReportAttachedFileService } from 'src/app/services/stage-report-attached-file.service';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';
import { EntityAttachedFile } from 'src/app/models/_ApiBase/EntityAttachedFile';
import { WrapperForValueType } from 'src/app/models/_ApiBase/WrapperForValueType';
import { FormatHelper } from 'src/app/helpers/FormatHelper';

@Component({
  selector: 'app-project-stage-report-details',
  templateUrl: './project-stage-report-details.component.html',
  styleUrls: ['./project-stage-report-details.component.css']
})
export class ProjectStageReportDetailsComponent extends ComponentWithAccessSegregation implements OnInit {
  public stageReport: StageReport = new StageReport();
  stageReportForm!: FormGroup;
  public isProjectStageReportUpdating: boolean = false;
  public isAttachedFilesCreating: WrapperForValueType<boolean> = new WrapperForValueType(false);

  constructor(
    private stageReportService: StageReportService,
    private stageReportAttachedFileService: StageReportAttachedFileService,
    protected override accessService: AccessService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectStageReportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StageReport) {
    super(accessService);
    this.stageReport = data;
  }

  public ngOnInit(): void {
    this.stageReportForm = this.formBuilder.group({
      reportDate: ['', Validators.required],
      name: ['', Validators.required],
      content: [''],
    });
    this.stageReportForm.patchValue(this.stageReport);
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.stageReportForm.valid) {
      this.isProjectStageReportUpdating = true;
      this.UpdateReport();
    }
    else {
      FormValidation.validateAllFormFields(this.stageReportForm);
    }
  }

  public ProcessInputFiles(filesInput: HTMLInputElement) {    
    FormatHelper.ProcessFilesFromInput(filesInput, this.isAttachedFilesCreating, this.snackBar, this.fileContentProcessedCallback.bind(this));    
    filesInput.value = '';
    
  }

  public DeleteFile(fileToDelete: EntityAttachedFile) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите открепить файл "${fileToDelete.fileName}"?`;
    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.stageReportAttachedFileService.Delete(fileToDelete.id)
            .subscribe({
              next: () => {
                this.stageReport.attachedFiles = this.stageReport.attachedFiles.filter((sraf: StageReportAttachedFile) => sraf.id != fileToDelete.id);
                this.snackBar.open(
                  `Файл ${fileToDelete.fileName} откреплён`,
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

  public DownloadFileContent(file: EntityAttachedFile) {
    file.isFileDownloading = true;
    this.stageReportAttachedFileService.GetFileContent(file.id).subscribe({
      next: (val: AttachFileModel) => {
        if (val) {
          if (val.fileContent) {
            let link = document.createElement('a');
            link.href = val.fileContent;
            link.download = val.fileName ?? "";
            link.click();
            file.isFileDownloading = false;
          }
        }
      }
    });
  }

  public GetImageMediumContent(image: EntityAttachedFile) {
    image.mediumImage.isFileContentProcessing = true;
    this.stageReportAttachedFileService.GetFileContent(image.id, true).subscribe({
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
    this.stageReportAttachedFileService.GetFileContent(image.id, false).subscribe({
      next: (response: AttachFileModel) => {
        if (response) {
          image.fileContent = new AttachFileModel(response);
          image.fileContent.isFileContentProcessing = false;
        }
      }
    });
  }  

  private fileContentProcessedCallback(processedFile: AttachFileModel) {
    let stageReportAttachedFile = new StageReportAttachedFile();
    //temp id
    stageReportAttachedFile.id = "id" + Math.random().toString(16).slice(2);
    stageReportAttachedFile.isFileCreating = true;
    stageReportAttachedFile.fileName = processedFile.fileName;
    stageReportAttachedFile.stageReportId = this.stageReport.id;
    let csraf = new CreateStageReportAttachedFileRequest();
    csraf.file = processedFile;
    csraf.stageReportId = this.stageReport.id;
    stageReportAttachedFile.fileContent = processedFile;
    stageReportAttachedFile.mediumImage = processedFile;
    this.stageReport.attachedFiles = [...this.stageReport.attachedFiles, stageReportAttachedFile]; 
    this.isAttachedFilesCreating.value = true;
    this.stageReportAttachedFileService.Create(csraf).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          stageReportAttachedFile.id = val.id;
          stageReportAttachedFile.createdByUser = val.createdByUser;
          stageReportAttachedFile.createdOn = val.createdOn;
          stageReportAttachedFile.updatedByUser = val.updatedByUser;
          stageReportAttachedFile.updatedOn = val.updatedOn;
          stageReportAttachedFile.isFileCreating = false;
          this.isAttachedFilesCreating.value = this.IsAtLeastOneAttachedFileCreating();
          if (!this.isAttachedFilesCreating.value) {
            this.snackBar.open(
              `Файл ${stageReportAttachedFile.fileName} прикреплён`,
              "Ок",
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-success']
              });
          }
        }
      },
      error: (error: any) => {
        stageReportAttachedFile.isFileCreating = false;
        this.isAttachedFilesCreating.value = this.IsAtLeastOneAttachedFileCreating();
        this.stageReport.attachedFiles = this.stageReport.attachedFiles.filter(srat => srat.id != stageReportAttachedFile.id);
      }
    });
  }

  private IsAtLeastOneAttachedFileCreating(): boolean {
    let check: boolean = false;
    this.stageReport.attachedFiles.forEach((file: StageReportAttachedFile) => {
      check = check || file.isFileCreating;
    });
    return check;
  }

  private UpdateReport() {
    Object.assign(this.stageReport, this.stageReportForm.value);
    this.stageReportService.Update(this.stageReport).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.stageReport.updatedByUser = val.updatedByUser;
          this.stageReport.updatedOn = val.updatedOn;
          this.isProjectStageReportUpdating = false;
          this.snackBar.open(
            "Информация обновлена",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
        }
      },
      error: (err: any) => {
        this.isProjectStageReportUpdating = false;
      }
    });
  }
}
