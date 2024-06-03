import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employees/Employee';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { EmployeesService } from 'src/app/services/employees.service';
import { EmployeeCreatorComponent } from '../employee-creator/employee-creator.component';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-employee-selector',
  templateUrl: './employee-selector.component.html',
  styleUrls: ['./employee-selector.component.css']
})
export class EmployeeSelectorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  employees: Array<Employee> = [];
  pageSettings: PageSettings = new PageSettings(this, true);

  constructor(
    private employeesService: EmployeesService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private dialogRef: MatDialogRef<EmployeeSelectorComponent>) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh(): void {
    this.PopulateEmployees();
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public EmployeeSelected(selectedEmployee: Employee) {
    this.dialogRef.close(selectedEmployee);
  }

  public CreateEmployee() {
    const dialogFormRef = this.dialog.open(EmployeeCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdEmployee: Employee) => {
        if (createdEmployee) {
          this.employees.unshift(createdEmployee);
          this.pageSettings.totalItems++;
          if (this.employees.length >= this.pageSettings.itemsPerPage) {
            this.employees.pop();
          }
        }
      },
    });
  }

  private PopulateEmployees() {
    this.employeesService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Employee>) => {
          this.employees = response.items.map(employee => new Employee(employee));;
          this.pageSettings.totalItems = response.totalItems;
        }
      })
  }
}
