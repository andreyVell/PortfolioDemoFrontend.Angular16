import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Position } from 'src/app/models/Position/Position';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { PositionService } from 'src/app/services/position.service';
import { PositionCreatorComponent } from '../position-creator/position-creator.component';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-position-selector',
  templateUrl: './position-selector.component.html',
  styleUrls: ['./position-selector.component.css']
})
export class PositionSelectorComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  positions: Array<Position> = [];
  pageSettings: PageSettings = new PageSettings(this, true);

  constructor(
    private positionService: PositionService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string,
    private dialogRef: MatDialogRef<PositionSelectorComponent>) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh(): void {
    this.PopulatePositions();
  }

  public CloseForm() {
    this.dialogRef.close(false);
  }

  public PositionSelected(selectedPosition: Position) {
    this.dialogRef.close(selectedPosition);
  }

  public CreatePosition() {
    const dialogFormRef = this.dialog.open(PositionCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdPosition: Position) => {
        if (createdPosition) {
          this.positions.unshift(createdPosition);
          this.pageSettings.totalItems++;
          if (this.positions.length >= this.pageSettings.itemsPerPage) {
            this.positions.pop();
          }
        }
      },
    });
  }

  private PopulatePositions() {
    this.positionService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Position>) => {
          this.positions = response.items;
          this.pageSettings.totalItems = response.totalItems;
        }
      })
  }
}
