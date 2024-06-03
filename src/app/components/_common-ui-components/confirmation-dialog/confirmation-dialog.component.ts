import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  confirmData: ConfirmData;

  constructor(    
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmData,
  ) {
    this.confirmData = data;
  }

  public DefaultYesClick(){
    this.CloseForm(true);
  }

  public DefaultNoClick(){
    this.CloseForm(false);
  }


  private CloseForm(result: any) {
    this.dialogRef.close(result);
  }
}
