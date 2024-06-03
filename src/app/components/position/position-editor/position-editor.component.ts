import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Position } from 'src/app/models/Position/Position';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AccessService } from 'src/app/services/access.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-position-editor',
  templateUrl: './position-editor.component.html',
  styleUrls: ['./position-editor.component.css']
})
export class PositionEditorComponent extends ComponentWithAccessSegregation {
  public position: Position = new Position();
  public isPositionUpdating: boolean = false;

  constructor(
    private positionService: PositionService,
    protected override accessService: AccessService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PositionEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Position) {
    super(accessService);
    this.position = data;
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.position.name) {
      this.isPositionUpdating = true;
      this.UpdatePosition();
    }
  }

  private UpdatePosition() {
    this.positionService.Update(this.position).subscribe({
      next: (response: ApiResponseSuccessfullUpdate) => {
        if (response.id) {
          this.position.updatedOn = response.updatedOn;
          this.position.updatedByUser = response.updatedByUser;
          this.snackBar.open(
            "Должность обновлена",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.dialogRef.close(this.position);
        }
      },
      error: (err: any) => {
        this.isPositionUpdating = false;
      }
    });
  }
}
