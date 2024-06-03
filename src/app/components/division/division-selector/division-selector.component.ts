import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Division } from 'src/app/models/Division/Division';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { DivisionService } from 'src/app/services/division.service';
import { DivisionCreatorComponent } from '../division-creator/division-creator.component';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { AccessService } from 'src/app/services/access.service';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';

@Component({
  selector: 'app-division-selector',
  templateUrl: './division-selector.component.html',
  styleUrls: ['./division-selector.component.css']
})
export class DivisionSelectorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  divisions: Array<Division> = [];
  pageSettings: PageSettings = new PageSettings(this, true);

  constructor(
    private divisionService: DivisionService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private dialogRef: MatDialogRef<DivisionSelectorComponent>) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh(): void {
    this.PopulateDivisions();
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public DivisionSelected(selectedDivision: Division) {
    this.dialogRef.close(selectedDivision);
  }

  public CreateDivision() {
    const dialogFormRef = this.dialog.open(DivisionCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdDivision: Division) => {
        if (createdDivision) {
          this.divisions.unshift(createdDivision);
          this.pageSettings.totalItems++;
          if (this.divisions.length >= this.pageSettings.itemsPerPage) {
            this.divisions.pop();
          }
        }
      },
    });
  }

  private PopulateDivisions() {
    this.divisionService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Division>) => {
          this.divisions = response.items;
          this.pageSettings.totalItems = response.totalItems;
        }
      })
  }
}
