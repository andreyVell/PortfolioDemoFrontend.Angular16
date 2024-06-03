import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Division } from 'src/app/models/Division/Division';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { DivisionService } from 'src/app/services/division.service';

@Component({
  selector: 'app-division-creator',
  templateUrl: './division-creator.component.html',
  styleUrls: ['./division-creator.component.css']
})
export class DivisionCreatorComponent implements OnInit {
  public parentDivision: Division | null = null;
  public newDivision: Division = new Division();
  public newDivisionForm!: FormGroup;
  public isDivisionCreating: boolean = false;

  constructor(
    private divisionService: DivisionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DivisionCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Division) {
    this.parentDivision = data;
  }

  public ngOnInit(): void {
    this.newDivisionForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.newDivisionForm.valid) {
      this.isDivisionCreating = true;
      this.CreateDivision();
    }
    else {
      FormValidation.validateAllFormFields(this.newDivisionForm);
    }
  }

  public GetParentDivisionName(): string {
    if (this.parentDivision?.name && this.parentDivision.name.length > 40) {
      return this.parentDivision.name.substring(0, 40) + '...';
    }
    return this.parentDivision?.name ?? "";
  }

  private CreateDivision() {
    this.newDivision.name = this.newDivisionForm.value.name;
    this.newDivision.parentDivisionId = this.parentDivision?.id ?? null;
    this.divisionService.Create(this.newDivision).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Подразделение добавлено",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.divisionService.Get(val.id)
            .subscribe({
              next: (response: Division) => {
                this.dialogRef.close(response);
              },
              error: (err: any) => {
                this.isDivisionCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isDivisionCreating = false;
      }
    });
  }

}
