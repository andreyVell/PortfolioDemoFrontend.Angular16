import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Division } from 'src/app/models/Division/Division';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AccessService } from 'src/app/services/access.service';
import { DivisionService } from 'src/app/services/division.service';

@Component({
  selector: 'app-division-editor',
  templateUrl: './division-editor.component.html',
  styleUrls: ['./division-editor.component.css']
})
export class DivisionEditorComponent extends ComponentWithAccessSegregation {
  division: Division = new Division();
  public isDivisionUpdating: boolean = false;

  constructor(
    private divisionService: DivisionService,
    protected override accessService: AccessService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DivisionEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Division) {
      super(accessService);
    this.division = data;
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.division.name) {
      this.isDivisionUpdating = true;
      this.UpdateDivision();
    }    
  }

  private UpdateDivision() {    
    this.divisionService.Update(this.division).subscribe({
      next: (response: ApiResponseSuccessfullUpdate) => {
        if (response.id) {
          this.division.updatedOn = response.updatedOn;
          this.division.updatedByUser = response.updatedByUser;
          this.snackBar.open(
            "Подразделение обновлено",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });  
          this.dialogRef.close(this.division);        
        }
      },
      error: (err: any) => {
        this.isDivisionUpdating = false;
      }
    });
  }
}
