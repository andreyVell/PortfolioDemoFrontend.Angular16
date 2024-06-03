import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { PositionCreatorComponent } from 'src/app/components/position/position-creator/position-creator.component';
import { PositionEditorComponent } from 'src/app/components/position/position-editor/position-editor.component';
import { Position } from 'src/app/models/Position/Position';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AccessService } from 'src/app/services/access.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-positions-page',
  templateUrl: './positions-page.component.html',
  styleUrls: ['./positions-page.component.css']
})
export class PositionsPageComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  positions: Array<Position> = [];

  constructor(
    private positionService: PositionService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string
  ) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh() {
    this.PopulatePositions();
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
      }
    });
  }

  public DeletePosition(position: Position) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить должность "${position.name}"?`;

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.positionService.Delete(position.id)
            .subscribe({
              next: () => {
                this.positions = this.positions.filter((p: Position) => p.id != position.id);
                this.pageSettings.totalItems--;
                this.snackBar.open(
                  "Должность удалена",
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

  public OpenPositionDetailsPage(position: Position) {
    const dialogFormRef = this.dialog.open(PositionEditorComponent, {
      data: position
    });
  }


  private PopulatePositions() {
    this.positionService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Position>) => {
          this.positions = response.items;
          this.pageSettings.totalItems = response.totalItems;
        }
      });
  }
}
