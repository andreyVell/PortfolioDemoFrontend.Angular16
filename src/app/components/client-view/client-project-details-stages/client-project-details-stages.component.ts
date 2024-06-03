import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/Project/Project';
import { ProjectStage } from 'src/app/models/ProjectStage/ProjectStage';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { ClientViewService } from 'src/app/services/client-view.service';

@Component({
  selector: 'app-client-project-details-stages',
  templateUrl: './client-project-details-stages.component.html',
  styleUrls: ['./client-project-details-stages.component.css']
})
export class ClientProjectDetailsStagesComponent extends AdaptiveComponent implements OnInit, ComponentWithPagination {
  @Input() project: Project = new Project();
  private readonly projectId: string;
  pageSettings: PageSettings = new PageSettings(this, true);
  projectStages: Array<ProjectStage> = [];
  dataSource = new MatTreeNestedDataSource<ProjectStage>();
  treeControl = new NestedTreeControl<ProjectStage>(node => node.childStages);

  constructor(
    private clientViewService: ClientViewService,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super();
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

  private PopulateProjectStages() {
    this.clientViewService.GetAllStagesForProject(this.projectId, this.pageSettings.currentFilterString)
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
}  
