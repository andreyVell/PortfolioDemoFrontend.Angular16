import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvetonRole } from 'src/app/models/AvetonRole/AvetonRole';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import FormValidation from 'src/app/helpers/FormValidation';
import { AvetonRoleService } from 'src/app/services/aveton-role.service';

@Component({
  selector: 'app-aveton-role-creator',
  templateUrl: './aveton-role-creator.component.html',
  styleUrls: ['./aveton-role-creator.component.css']
})
export class AvetonRoleCreatorComponent {
  public newAvetonRole: AvetonRole = new AvetonRole();
  public newAvetonRoleForm!: FormGroup;
  public isRoleCreating: boolean = false;

  constructor(
    private avetonRoleService: AvetonRoleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AvetonRoleCreatorComponent>
  ){

  }

  ngOnInit(): void {
    this.newAvetonRoleForm = this.formBuilder.group({
      name: ['', Validators.required],
      isDefault: [false, Validators.required],
      isSystemAdministrator: [false, Validators.required],
    });
  }


  onFormSubmit() {
    if (this.newAvetonRoleForm.valid) {     
      this.isRoleCreating = true; 
      this.newAvetonRole.name = this.newAvetonRoleForm.value.name;
      this.newAvetonRole.isDefault = this.newAvetonRoleForm.value.isDefault;
      this.newAvetonRole.isSystemAdministrator = this.newAvetonRoleForm.value.isSystemAdministrator;

      this.CreateAvetonRole();
    }
    else {
      FormValidation.validateAllFormFields(this.newAvetonRoleForm);
    }
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }   

  private CreateAvetonRole(){
    this.avetonRoleService.Create(this.newAvetonRole).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Роль добавлена",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.avetonRoleService.Get(val.id)
            .subscribe({
              next: (response: AvetonRole) => {
                this.dialogRef.close(response);
              },
              error: (err: any) => {
                this.isRoleCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isRoleCreating = false;
      }
    });
  }
}
