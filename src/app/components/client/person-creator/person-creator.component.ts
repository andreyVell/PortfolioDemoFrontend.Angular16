import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { Person } from 'src/app/models/Client/Person';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-person-creator',
  templateUrl: './person-creator.component.html',
  styleUrls: ['./person-creator.component.css']
})
export class PersonCreatorComponent implements OnInit {
  newPerson: Person = new Person();
  newPersonForm!: FormGroup;
  public isPersonCreating: boolean = false;

  constructor(
    private personService: PersonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PersonCreatorComponent>) {

  }

  public ngOnInit(): void {
    this.newPersonForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      secondName: [''],
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
    if (this.newPersonForm.valid) {
      this.isPersonCreating = true;
      this.CreatePerson();
    }
    else {
      FormValidation.validateAllFormFields(this.newPersonForm);
    }
  }

  private CreatePerson() {
    Object.assign(this.newPerson, this.newPersonForm.value);
    this.personService.Create(this.newPerson).subscribe({
      next: (val: ApiResponseSuccessfullCreate) => {
        if (val.id) {
          this.snackBar.open(
            "Клиент добавлен",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
          this.personService.Get(val.id)
            .subscribe({
              next: (response: Person) => {
                this.dialogRef.close(new Person(response));
              },
              error: (err: any) => {
                this.isPersonCreating = false;
              }
            });
        }
      },
      error: (err: any) => {
        this.isPersonCreating = false;
      }
    });
  }
}
