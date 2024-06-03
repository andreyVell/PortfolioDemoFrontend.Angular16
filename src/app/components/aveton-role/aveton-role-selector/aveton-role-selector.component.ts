import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AvetonRole } from 'src/app/models/AvetonRole/AvetonRole';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AvetonRoleService } from 'src/app/services/aveton-role.service';
import { AvetonRoleCreatorComponent } from '../aveton-role-creator/aveton-role-creator.component';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-aveton-role-selector',
  templateUrl: './aveton-role-selector.component.html',
  styleUrls: ['./aveton-role-selector.component.css']
})
export class AvetonRoleSelectorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  roles: Array<AvetonRole> = [];
  pageSettings: PageSettings = new PageSettings(this, true);

  constructor(
    private avetonRoleService: AvetonRoleService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private dialogRef: MatDialogRef<AvetonRoleSelectorComponent>) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh(): void {
    this.PopulateRoles();
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public RoleSelected(seletedRole: AvetonRole) {
    this.dialogRef.close(seletedRole);
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

  private PopulateRoles() {
    this.avetonRoleService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<AvetonRole>) => {
          this.roles = response.items;
          this.pageSettings.totalItems = response.totalItems;
        }
      })
  }
}
