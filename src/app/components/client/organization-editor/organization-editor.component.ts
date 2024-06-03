import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Organization } from 'src/app/models/Client/Organization';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AccessService } from 'src/app/services/access.service';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.css']
})
export class OrganizationEditorComponent extends ComponentWithAccessSegregation implements OnInit {
  organization: Organization = new Organization();
  organizationForm!: FormGroup;
  public isOrganizationUpdating: boolean = false;

  constructor(
    private organizationService: OrganizationService,
    protected override accessService: AccessService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OrganizationEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Organization) {
    super(accessService);
    this.organization = data;
  }

  public ngOnInit(): void {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      inn: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.organizationForm.patchValue(this.organization);
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.organizationForm.valid) {
      this.isOrganizationUpdating = true;
      this.UpdateOrganization();
    }
    else {
      FormValidation.validateAllFormFields(this.organizationForm);
    }
  }

  private UpdateOrganization() {
    Object.assign(this.organization, this.organizationForm.value);
    this.organizationService.Update(this.organization).subscribe({
      next: (response: ApiResponseSuccessfullUpdate) => {
        if (response.id) {
          this.organization.updatedOn = response.updatedOn;
          this.organization.updatedByUser = response.updatedByUser;
          this.snackBar.open(
            "Данные организации обновлены",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.dialogRef.close(new Organization(this.organization));
        }
      },
      error: (err: any) => {
        this.isOrganizationUpdating = false;
      }
    });
  }
}

