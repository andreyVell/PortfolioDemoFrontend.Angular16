import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { DivisionCreatorComponent } from 'src/app/components/division/division-creator/division-creator.component';
import { DivisionEditorComponent } from 'src/app/components/division/division-editor/division-editor.component';
import { DivisionDisplayMode } from 'src/app/models/Division/DivisionDisplayMode';
import { Division } from 'src/app/models/Division/Division';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { DivisionService } from 'src/app/services/division.service';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-divisions-page',
  templateUrl: './divisions-page.component.html',
  styleUrls: ['./divisions-page.component.css']
})
export class DivisionsPageComponent extends ComponentWithAccessSegregation implements ComponentWithPagination {
  pageSettings: PageSettings = new PageSettings(this, true);
  divisions: Array<Division> = [];
  displayMode: DivisionDisplayMode = DivisionDisplayMode.Hierarchy;
  dataSource = new MatTreeNestedDataSource<Division>();
  treeControl = new NestedTreeControl<Division>(node => node.childDivisions);

  constructor(
    private divisionService: DivisionService,
    protected override accessService: AccessService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super(accessService);
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
    this.pageSettings.ApplyFilter();
  }

  public Refresh() {
    switch (this.displayMode) {
      case DivisionDisplayMode.List: {
        this.PopulateDivisions();
        break;
      }
      case DivisionDisplayMode.Hierarchy: {
        this.PopulateNestedListDivisions();
        break;
      }
    }
  }

  public CreateDivision() {
    const dialogFormRef = this.dialog.open(DivisionCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdDivision: Division) => {
        if (createdDivision) {
          switch (this.displayMode) {
            case DivisionDisplayMode.List: {
              this.divisions.unshift(createdDivision);
              this.pageSettings.totalItems++;
              if (this.divisions.length >= this.pageSettings.itemsPerPage) {
                this.divisions.pop();
              }
              break;
            }
            case DivisionDisplayMode.Hierarchy: {
              this.dataSource.data.push(createdDivision);
              //some update magic
              this.dataSource.data = this.dataSource.data;
            }
          }
        }
      },
    });
  }

  public CreateChildDivision(parentDivision: Division) {
    const dialogFormRef = this.dialog.open(DivisionCreatorComponent, {
      data: parentDivision
    });
    dialogFormRef.afterClosed().subscribe({
      next: (createdDivision: Division) => {
        if (createdDivision) {
          switch (this.displayMode) {
            case DivisionDisplayMode.List: {
              this.divisions.unshift(createdDivision);
              this.pageSettings.totalItems++;
              if (this.divisions.length >= this.pageSettings.itemsPerPage) {
                this.divisions.pop();
              }
              break;
            }
            case DivisionDisplayMode.Hierarchy: {              
              if (!parentDivision.childDivisions) {
                parentDivision.childDivisions = new Array<Division>();
              }
              parentDivision.childDivisions.push(createdDivision);
              this.dataSource.data = [];
              this.dataSource.data = this.divisions;
              break;
            }
          }

        }
      },
    });
  }

  public DeleteDivision(division: Division) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить подразделение "${division.name}"?`;
    if ((division.childDivisions?.length ?? 0) > 0) {
      confirmData.subContent = '(ВНИМАНИЕ: Будут удалены все дочерние подразделения)';
    }

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.divisionService.Delete(division.id)
            .subscribe({
              next: () => {
                switch (this.displayMode) {
                  case DivisionDisplayMode.List: {
                    this.DeleteDevisionAndChildsFromList(division);
                    break;
                  }
                  case DivisionDisplayMode.Hierarchy: {
                    this.DeleteDevisionAndChildsFromNestedList(division);
                    break;
                  }
                }
                this.snackBar.open(
                  "Подразделение удалено",
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

  public OpenDivisionDetailsPage(division: Division) {
    const dialogFormRef = this.dialog.open(DivisionEditorComponent, {
      data: division
    });
  }

  public HasChild = (_: number, node: Division) => !!node.childDivisions && node.childDivisions.length > 0;

  public ExpandAll() {
    this.divisions.forEach((div: Division) => {
      this.treeControl.expandDescendants(div);
    })
  }

  public CollapseAll() {
    this.divisions.forEach((div: Division) => {
      this.treeControl.collapseDescendants(div);
    })
  }

  private PopulateDivisions() {
    this.divisionService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Division>) => {
          this.divisions = response.items;
          this.pageSettings.totalItems = response.totalItems;
        }
      });
  }

  private PopulateNestedListDivisions() {
    this.divisionService.GetNestedListDivisions(this.pageSettings.currentFilterString)
      .subscribe({
        next: (response: Division[]) => {
          this.divisions = response;
          this.dataSource.data = this.divisions;
          if (this.pageSettings.currentFilterString) {
            response.forEach((div: Division) => {
              this.treeControl.expandDescendants(div);
            })
          }
        }
      });
  }

  private DeleteDevisionAndChildsFromList(division: Division) {
    this.divisions.filter((d: Division) => d.parentDivisionId === division.id).forEach((d: Division) => {
      this.DeleteDevisionAndChildsFromList(d);
    })
    this.divisions = this.divisions.filter((d: Division) => d.id != division.id);
    this.pageSettings.totalItems--;
  }

  private DeleteDevisionAndChildsFromNestedList(division: Division) {
    if (!division.parentDivisionId) {
      this.divisions = this.divisions.filter((d: Division) => d.id != division.id);
    }
    else {
      for (let i = 0; i < (this.divisions?.length ?? 0); i++) {
        if (this.DeleteDivisionFromChilds(this.divisions[i], division)) {
          break;
        }
      }
    }
    this.dataSource.data = [];
    this.dataSource.data = this.divisions;
  }

  private DeleteDivisionFromChilds(rootDivision: Division, divisionToDelete: Division): boolean {
    if (rootDivision.childDivisions?.find((child: Division) => child.id === divisionToDelete.id)) {
      rootDivision.childDivisions = rootDivision.childDivisions.filter((d: Division) => d.id != divisionToDelete.id);
      return true;
    }
    else {
      for (let i = 0; i < (rootDivision.childDivisions?.length ?? 0); i++) {
        if (this.DeleteDivisionFromChilds(rootDivision.childDivisions![i], divisionToDelete)) {
          return true;
        }
      }
    }
    return false;
  }
}
