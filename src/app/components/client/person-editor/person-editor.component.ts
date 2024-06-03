import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Person } from 'src/app/models/Client/Person';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ApiResponseSuccessfullUpdate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullUpdate';
import { AccessService } from 'src/app/services/access.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-person-editor',
  templateUrl: './person-editor.component.html',
  styleUrls: ['./person-editor.component.css']
})
export class PersonEditorComponent extends ComponentWithAccessSegregation implements OnInit {
  person: Person = new Person();
  personForm!: FormGroup;
  public isPersonUpdating: boolean = false;

  constructor(
    private personService: PersonService,
    protected override accessService: AccessService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PersonEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Person) {
    super(accessService);
    this.person = data;
  }

  public ngOnInit(): void {
    this.personForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      secondName: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.personForm.patchValue(this.person);
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public OnFormSubmit() {
    if (this.personForm.valid) {
      this.isPersonUpdating = true;
      this.UpdatePerson();
    }
    else {
      FormValidation.validateAllFormFields(this.personForm);
    }
  }

  private UpdatePerson() {
    Object.assign(this.person, this.personForm.value);
    this.personService.Update(this.person).subscribe({
      next: (response: ApiResponseSuccessfullUpdate) => {
        if (response.id) {
          this.person.updatedOn = response.updatedOn;
          this.person.updatedByUser = response.updatedByUser;
          this.snackBar.open(
            "Данные клиента обновлены",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.dialogRef.close(new Person(this.person));
        }
      },
      error: (err: any) => {
        this.isPersonUpdating = false;
      }
    });
  }
}
