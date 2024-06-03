import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AvetonRoleCreatorComponent } from 'src/app/components/aveton-role/aveton-role-creator/aveton-role-creator.component';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { AvetonRole } from 'src/app/models/AvetonRole/AvetonRole';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AccessService } from 'src/app/services/access.service';
import { AvetonRoleService } from 'src/app/services/aveton-role.service';

@Component({
  selector: 'app-roles-page',
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.css']
})
export class RolesPageComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  roles: Array<AvetonRole> = [];


  constructor(
    private avetonRoleService: AvetonRoleService,
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
    this.PopulateRoles();
  }

  private PopulateRoles() {
    this.avetonRoleService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<AvetonRole>) => {
          this.roles = response.items;
          this.pageSettings.totalItems = response.totalItems;
        }
      })
  }


  public CreateRole() {
    const dialogFormRef = this.dialog.open(AvetonRoleCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdRole: AvetonRole) => {
        if (createdRole) {
          this.roles.unshift(createdRole);
          this.pageSettings.totalItems++;
          if (this.roles.length >= this.pageSettings.itemsPerPage) {
            this.roles.pop();
          }
        }
      },
    });
  }

  public OpenRoleDetailsPage(role: AvetonRole) {
    this.router.navigate(['Employees/Roles', role.id]);
  }

  public DeleteRole(role: AvetonRole) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить роль "${role.name}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.avetonRoleService.Delete(role.id)
            .subscribe({
              next: () => {
                this.roles = this.roles.filter((r: AvetonRole) => r.id != role.id);
                this.pageSettings.totalItems--;
                this.snackBar.open(
                  "Роль удалёна",
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

}