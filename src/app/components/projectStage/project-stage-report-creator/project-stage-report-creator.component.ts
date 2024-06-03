import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { CreateStageReport } from 'src/app/models/StageReport/CreateStageReport';
import { StageReport } from 'src/app/models/StageReport/StageReport';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { WrapperForValueType } from 'src/app/models/_ApiBase/WrapperForValueType';
import { StageReportService } from 'src/app/services/stage-report.service';

@Component({
  selector: 'app-project-stage-report-creator',
  templateUrl: './project-stage-report-creator.component.html',
  styleUrls: ['./project-stage-report-creator.component.css']
})
export class ProjectStageReportCreatorComponent extends AdaptiveComponent implements OnInit  {
  newStageReport: CreateStageReport = new CreateStageReport();
  newStageReportForm!: FormGroup;
  isReportCreating: boolean = false;
  public isFilesProcessing: WrapperForValueType<boolean> = new WrapperForValueType(false);

  constructor(
    private stageReportService: StageReportService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectStageReportCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public projectStageId: string) {
    super();
    this.newStageReport.projectStageId = this.projectStageId;
  }

  public ngOnInit(): void {
    this.newStageReportForm = this.formBuilder.group({
      reportDate: ['', Validators.required],
      name: ['', Validators.required],
      content: [''],
    });
    this.newStageReportForm.patchValue(this.newStageReport);
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.newStageReportForm.valid) {
      this.isReportCreating = true;
      this.CreateReport();
    }
    else {
      FormValidation.validateAllFormFields(this.newStageReportForm);
    }
  }

  public ProcessInputFiles(filesInput: any) {
    let processedFiles = FormatHelper.ProcessFilesFromInput(filesInput, this.isFilesProcessing, this.snackBar);
    processedFiles.forEach(file => {
      this.newStageReport.attachedFiles.unshift(file);
    })
    filesInput.value = '';
  }

  public DeleteFile(file: AttachFileModel) {
    this.newStageReport.attachedFiles = this.newStageReport.attachedFiles.filter((sraf: AttachFileModel) => sraf != file);
  }  

  private CreateReport() {
    Object.assign(this.newStageReport, this.newStageReportForm.value);
    this.stageReportService.Create(this.newStageReport).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Отчёт создан",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.stageReportService.Get(val.id)
            .subscribe({
              next: (response: StageReport) => {
                this.dialogRef.close(new StageReport(response));
              },
              error: (err: any) => {
                this.isReportCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isReportCreating = false;
      }
    });
  }
}
