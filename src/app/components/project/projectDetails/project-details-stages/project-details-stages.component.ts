import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/components/_common-ui-components/confirmation-dialog/confirmation-dialog.component';
import { ProjectStageCreatorComponent } from 'src/app/components/projectStage/project-stage-creator/project-stage-creator.component';
import { Project } from 'src/app/models/Project/Project';
import { ProjectStage } from 'src/app/models/ProjectStage/ProjectStage';
import { ProjectStageCreatorData } from 'src/app/models/ProjectStage/ProjectStageCreatorData';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ConfirmData } from 'src/app/models/_ConfirmDialog/ConfirmData';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AccessService } from 'src/app/services/access.service';
import { ProjectStageService } from 'src/app/services/project-stage.service';

@Component({
  selector: 'app-project-details-stages',
  templateUrl: './project-details-stages.component.html',
  styleUrls: ['./project-details-stages.component.css']
})
export class ProjectDetailsStagesComponent extends ComponentWithAccessSegregation implements OnInit, ComponentWithPagination {
  @Input() project: Project = new Project();
  private readonly projectId: string;
  pageSettings: PageSettings = new PageSettings(this, true);
  projectStages: Array<ProjectStage> = [];
  dataSource = new MatTreeNestedDataSource<ProjectStage>();
  treeControl = new NestedTreeControl<ProjectStage>(node => node.childStages);

  constructor(
    private projectStageService: ProjectStageService,
    protected override accessService: AccessService,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super(accessService);
    this.projectId = activateRoute.snapshot.params['projectId'];
    this.locale = 'ru';
    this.adapter.setLocale(this.locale);
  }
  public ngOnInit(): void {
    this.pageSettings.ApplyFilter();
  }

  public Refresh() {
    this.PopulateProjectStages();
  }

  public CreateNewProjectStage() {
    let projectStageCreatorData = new ProjectStageCreatorData();
    projectStageCreatorData.projectId = this.projectId;
    projectStageCreatorData.parentStage = null;
    const dialogFormRef = this.dialog.open(ProjectStageCreatorComponent, {
      data: projectStageCreatorData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (createdProjectStage: ProjectStage) => {
        if (createdProjectStage) {
          this.dataSource.data.push(createdProjectStage);
          //some update magic
          this.dataSource.data = this.dataSource.data;
          if (this.project.currentProgress === -1) {
            this.project.currentProgress = 0;
          }
        }
      },
    });
  }

  public CreateChildProjectStage(parentStage: ProjectStage) {
    let projectStageCreatorData = new ProjectStageCreatorData();
    projectStageCreatorData.projectId = this.projectId;
    projectStageCreatorData.parentStage = parentStage;
    const dialogFormRef = this.dialog.open(ProjectStageCreatorComponent, {
      data: projectStageCreatorData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (createdProjectStage: ProjectStage) => {
        if (createdProjectStage) {
          if (!parentStage.childStages) {
            parentStage.childStages = new Array<ProjectStage>();
          }
          parentStage.childStages.push(createdProjectStage);
          this.dataSource.data = [];
          this.dataSource.data = this.projectStages;
        }
      },
    });
  }

  public DeleteProjectStage(projectStage: ProjectStage) {
    let confirmData = new ConfirmData();
    confirmData.title = 'Внимание';
    confirmData.content = `Вы уверены что хотите удалить этап "${projectStage.name}"?`;
    if ((projectStage.childStages?.length ?? 0) > 0) {
      confirmData.subContent = '(ВНИМАНИЕ: Будут удалены все дочерние этапы)';
    }

    const dialogFormRef = this.dialog.open(ConfirmationDialogComponent, {
      data: confirmData,
    });
    dialogFormRef.afterClosed().subscribe({
      next: (answer: any) => {
        if (answer) {
          this.projectStageService.Delete(projectStage.id)
            .subscribe({
              next: () => {
                this.DeleteProjectStageAndChildsFromNestedList(projectStage);
                this.snackBar.open(
                  "Этап удалён",
                  "Ок",
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 4000,
                    panelClass: ['snack-bar-success']
                  });
                if (this.projectStages.length === 0) {
                  this.project.currentProgress = -1;
                }
              }
            })
        }
      },
    });
  }

  public HasChild = (_: number, node: ProjectStage) => !!node.childStages && node.childStages.length > 0;

  public GetCompletionStatus(node: ProjectStage): string {
    let progress = node.currentProgress;
    if (progress == 0) {
      return 'Не начат';
    }
    if (progress == 1) {
      return 'Завершён';
    }
    if (progress > 0 && progress < 1) {
      return 'В процессе' + ` (${(progress * 100).toFixed(2)}%)`;
    }
    return 'Неизвестно';
  }

  public GetCompletionStatusClass(node: ProjectStage): string {
    let progress = node.currentProgress;
    if (progress == 0) {
      return 'stage-not-started-color';
    }
    if (progress == 1) {
      return 'stage-completed-color';
    }
    if (progress > 0 && progress < 1) {
      return 'stage-in-progress-color';
    }
    return '';
  }

  public ExpandAll() {
    this.projectStages.forEach((projectStage: ProjectStage) => {
      this.treeControl.expandDescendants(projectStage);
    })
  }

  public CollapseAll() {
    this.projectStages.forEach((projectStage: ProjectStage) => {
      this.treeControl.collapseDescendants(projectStage);
    })
  }

  public GetNodeName(node: ProjectStage):string{
    if (this.IsSmallScreen() && node.name && node.name.length > 40) {
      return node.name.substring(0, 40) + '...';
    }
    return node.name;
  }

  private PopulateProjectStages() {
    this.projectStageService.GetAllForProject(this.projectId, this.pageSettings.currentFilterString)
      .subscribe({
        next: (response: ProjectStage[]) => {
          this.projectStages = response.map(e => new ProjectStage(e))
            .sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : ((b.orderNumber > a.orderNumber) ? -1 : 0));
          this.dataSource.data = this.projectStages;
          if (this.pageSettings.currentFilterString) {
            this.ExpandAll();
          }
        }
      });
  }

  private DeleteProjectStageAndChildsFromNestedList(projectStageToDelete: ProjectStage) {
    if (!projectStageToDelete.parentStageId) {
      this.projectStages = this.projectStages.filter((ps: ProjectStage) => ps.id != projectStageToDelete.id);
    }
    else {
      for (let i = 0; i < (this.projectStages?.length ?? 0); i++) {
        if (this.DeleteProjectStageFromChilds(this.projectStages[i], projectStageToDelete)) {
          break;
        }
      }
    }
    this.dataSource.data = [];
    this.dataSource.data = this.projectStages;
  }

  //returns true after successful deletion
  private DeleteProjectStageFromChilds(rootProjectStage: ProjectStage, projectStageToDelete: ProjectStage): boolean {
    if (rootProjectStage.childStages?.find((child: ProjectStage) => child.id === projectStageToDelete.id)) {
      rootProjectStage.childStages = rootProjectStage.childStages.filter((d: ProjectStage) => d.id != projectStageToDelete.id);
      return true;
    }
    else {
      for (let i = 0; i < (rootProjectStage.childStages?.length ?? 0); i++) {
        if (this.DeleteProjectStageFromChilds(rootProjectStage.childStages![i], projectStageToDelete)) {
          return true;
        }
      }
    }
    return false;
  }
}
