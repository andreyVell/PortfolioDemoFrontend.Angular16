import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeCreatorComponent } from 'src/app/components/employees/employee-creator/employee-creator.component';
import { Employee } from 'src/app/models/Employees/Employee';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AttachFileModel } from 'src/app/models/_ApiBase/AttachFileModel';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AccessService } from 'src/app/services/access.service';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employees-page',
  templateUrl: './employees-page.component.html',
  styleUrls: ['./employees-page.component.css']
})
export class EmployeesPageComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  public pageSettings: PageSettings = new PageSettings(this, true);
  public employees: Array<Employee> = [];
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';

  constructor(
    private employeesService: EmployeesService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
      super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }




  public Refresh() {
    this.PopulateEmployees();
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

  public DeleteEmployee(employee: Employee) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить сотрудника "${employee.GetFullName()}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.employeesService.Delete(employee.id)
            .subscribe({
              next: () => {
                this.employees = this.employees.filter((r: Employee) => r.id != employee.id);
                this.pageSettings.totalItems--;
                this.snackBar.open(
                  "Сотрудник удалён",
                  "Ок",
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 4000,
                    panelClass: ['snack-bar-success']
                  });
              }
            })
        }
      },
    });
  }

  public OpenEmployeeDetailsPage(employee: Employee) {
    this.router.navigate(['Employees/Details', employee.id]);
  }


  private PopulateEmployees() {
    this.employeesService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Employee>) => {
          this.employees = response.items.map(employee => new Employee(employee));
          this.pageSettings.totalItems = response.totalItems;
          this.PopulateEmployeesAvatars();
        }
      })
  }

  private PopulateEmployeesAvatars(){
    this.employees.forEach((employee: Employee) => {
      this.employeesService.GetEmployeeSmallAvatar(employee.id)
      .subscribe({
        next: (response: AttachFileModel) => {
          employee.employeeSmallAvatar = response;
        }
      })
    })
  }
}
