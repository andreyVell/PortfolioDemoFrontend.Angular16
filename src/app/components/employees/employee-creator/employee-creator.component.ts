import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import FormValidation from 'src/app/helpers/FormValidation';
import { FormatHelper } from 'src/app/helpers/FormatHelper';
import { Employee } from 'src/app/models/Employees/Employee';
import { ApiResponseSuccessfullCreate } from 'src/app/models/_ApiBase/ApiResponseSuccessfullCreate';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employee-creator',
  templateUrl: './employee-creator.component.html',
  styleUrls: ['./employee-creator.component.css']
})
export class EmployeeCreatorComponent {
  public newEmployee: Employee = new Employee();
  public newEmployeeForm!: FormGroup;
  public isEmployeeCreating: boolean = false;

  constructor(
    private employeeService: EmployeesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeCreatorComponent>
  ) {

  }

  public ngOnInit(): void {
    this.newEmployeeForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      secondName: [''],
      mobilePhoneNumber: ['',],
      email: [''],
      birthday: [null],
    });
  }


  public OnFormSubmit() {
    if (this.newEmployeeForm.valid) {
      this.isEmployeeCreating = true;
      this.newEmployee.firstName = this.newEmployeeForm.value.firstName;
      this.newEmployee.lastName = this.newEmployeeForm.value.lastName;
      this.newEmployee.secondName = this.newEmployeeForm.value.secondName;
      this.newEmployee.email = this.newEmployeeForm.value.email;
      this.newEmployee.mobilePhoneNumber = this.newEmployeeForm.value.mobilePhoneNumber;
      this.newEmployee.birthday = this.newEmployeeForm.value.birthday;
      this.CreateEmployee();
    }
    else {
      FormValidation.validateAllFormFields(this.newEmployeeForm);
    }
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  private CreateEmployee() {
    this.employeeService.Create(this.newEmployee)
      .subscribe({
        next: (response: ApiResponseSuccessfullCreate) => {
          if (response.id) {
            this.snackBar.open(
              "Сотрудник добавлен",
              "Ок", {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 4000,
              panelClass: ['snack-bar-success']
            });
            this.employeeService.Get(response.id)
              .subscribe({
                next: (response: Employee) => {
                  this.dialogRef.close(new Employee(response));
                },
                error: (response: any) => {
                  this.isEmployeeCreating = false;
                }
              });
          }
        },
        error: (response: any) => {
          this.isEmployeeCreating = false;
        }
      })
  }
}
