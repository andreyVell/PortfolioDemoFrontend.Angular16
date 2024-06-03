import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Position } from 'src/app/models/Position/Position';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-position-creator',
  templateUrl: './position-creator.component.html',
  styleUrls: ['./position-creator.component.css']
})
export class PositionCreatorComponent implements OnInit {
  public newPosition: Position = new Position();
  public newPositionForm!: FormGroup;
  public isPositionCreating: boolean = false;

  constructor(
    private positionService: PositionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PositionCreatorComponent>) {

  }

  public ngOnInit(): void {
    this.newPositionForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.newPositionForm.valid) {
      this.isPositionCreating = true;
      this.CreatePosition();
    }
    else {
      FormValidation.validateAllFormFields(this.newPositionForm);
    }
  }

  private CreatePosition() {
    this.newPosition.name = this.newPositionForm.value.name;
    this.positionService.Create(this.newPosition).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Должность добавлена",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.positionService.Get(val.id)
            .subscribe({
              next: (response: Position) => {
                this.dialogRef.close(response);
              },
              error: (err: any) => {
                this.isPositionCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isPositionCreating = false;
      }
    });
  }
}
