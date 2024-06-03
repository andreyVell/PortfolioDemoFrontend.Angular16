import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Project } from 'src/app/models/Project/Project';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-creator',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.css']
})
export class ProjectCreatorComponent implements OnInit {
  newProject: Project = new Project();
  newProjectForm!: FormGroup;
  public isProjectCreating: boolean = false;

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ProjectCreatorComponent>) {

  }

  public ngOnInit(): void {
    this.newProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.newProjectForm.valid) {
      this.isProjectCreating = true;
      this.CreateProject();
    }
    else {
      FormValidation.validateAllFormFields(this.newProjectForm);
    }
  }

  private CreateProject() {
    Object.assign(this.newProject, this.newProjectForm.value);
    this.projectService.Create(this.newProject).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Проект создан",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.projectService.Get(val.id)
            .subscribe({
              next: (response: Project) => {
                this.dialogRef.close(new Project(response));
              },
              error: (err: any) => {
                this.isProjectCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isProjectCreating = false;
      }
    });
  }
}
