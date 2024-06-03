import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { ProjectStage } from 'src/app/models/ProjectStage/ProjectStage';
import { ProjectStageCreatorData } from 'src/app/models/ProjectStage/ProjectStageCreatorData';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ProjectStageService } from 'src/app/services/project-stage.service';

@Component({
  selector: 'app-project-stage-creator',
  templateUrl: './project-stage-creator.component.html',
  styleUrls: ['./project-stage-creator.component.css']
})
export class ProjectStageCreatorComponent implements OnInit {
  newProjectStage: ProjectStage = new ProjectStage();
  newProjectStageForm!: FormGroup;
  public isProjectStageCreating: boolean = false;

  constructor(
    private projectStageService: ProjectStageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectStageCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectStageCreatorData) {
    this.newProjectStage.projectId = data.projectId ?? "";
    this.newProjectStage.parentStageId = data.parentStage?.id ?? null;
  }

  public ngOnInit(): void {
    this.newProjectStageForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.newProjectStageForm.valid) {
      this.isProjectStageCreating = true;
      this.CreateProjectStage();
    }
    else {
      FormValidation.validateAllFormFields(this.newProjectStageForm);
    }
  }

  public GetParentStageName(): string {
    if (this.data?.parentStage?.name && this.data.parentStage.name.length > 40) {
      return this.data.parentStage.name.substring(0, 40) + '...';
    }
    return this.data?.parentStage?.name ?? "";
  }

  private CreateProjectStage() {
    Object.assign(this.newProjectStage, this.newProjectStageForm.value);
    this.projectStageService.Create(this.newProjectStage).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Этап создан",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.projectStageService.Get(val.id)
            .subscribe({
              next: (response: ProjectStage) => {
                this.dialogRef.close(new ProjectStage(response));
              },
              error: (err: any) => {
                this.isProjectStageCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isProjectStageCreating = false;
      }
    });
  }
}
