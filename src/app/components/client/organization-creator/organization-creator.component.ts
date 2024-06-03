import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Organization } from 'src/app/models/Client/Organization';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-organization-creator',
  templateUrl: './organization-creator.component.html',
  styleUrls: ['./organization-creator.component.css']
})
export class OrganizationCreatorComponent implements OnInit {
  public newOrganization: Organization = new Organization();
  public newOrganizationForm!: FormGroup;
  public isOrganizationCreating: boolean = false;

  constructor(
    private organizationService: OrganizationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OrganizationCreatorComponent>) {

  }

  public ngOnInit(): void {
    this.newOrganizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      inn: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.newOrganizationForm.valid) {
      this.isOrganizationCreating = true;
      this.CreatePerson();
    }
    else {
      FormValidation.validateAllFormFields(this.newOrganizationForm);
    }
  }

  private CreatePerson() {
    Object.assign(this.newOrganization, this.newOrganizationForm.value);
    this.organizationService.Create(this.newOrganization).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Организация добавлена",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.organizationService.Get(val.id)
            .subscribe({
              next: (response: Organization) => {
                this.dialogRef.close(new Organization(response));
              },
              error: (err: any) => {
                this.isOrganizationCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isOrganizationCreating = false;
      }
    });
  }
}

