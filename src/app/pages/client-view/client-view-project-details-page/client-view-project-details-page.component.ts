import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/Project/Project';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { ClientViewService } from 'src/app/services/client-view.service';

@Component({
  selector: 'app-client-view-project-details-page',
  templateUrl: './client-view-project-details-page.component.html',
  styleUrls: ['./client-view-project-details-page.component.css']
})
export class ClientViewProjectDetailsComponent extends AdaptiveComponent implements AfterViewInit {
  @ViewChild("tabGroup", { static: false }) tabGroup!: MatTabGroup;
  private readonly projectId: string;
  public project: Project = new Project();
  public projectHeader: string = 'Загрузка...';

  constructor(
    private clientViewService: ClientViewService,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private titleService: Title
  ) {
    super();
    this.projectId = activateRoute.snapshot.params['projectId'];
    this.PopulateProject();
  }

  public BackPageClick() {
    this.router.navigate(['ClientView']);
  }

  public ngAfterViewInit(): void {
    const currTab = this.activateRoute.snapshot.params['activeTab'];
    if (!this.tabGroup) return;
    switch (currTab) {
      case 'Info': {
        this.tabGroup.selectedIndex = 0;
        break;
      }
      case 'Stages': {
        this.tabGroup.selectedIndex = 1;
        break;
      }
    }
  }

  public TabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent && tabChangeEvent.tab.textLabel) {
      this.router.navigate(['ClientView/Project/Details', this.projectId, tabChangeEvent.tab.textLabel]);
    }
  }

  public GetCompletionStatus(): string {
    switch (this.project.currentProgress) {
      case 1: {
        return 'Завершён';
      }
      case 0: {
        return 'Не начат';
      }
      case -1: {
        return '';
      }
      default: {
        return 'В процессе' + ` (${(this.project.currentProgress * 100).toFixed(2)}%)`;
      }
    }
  }

  public GetCompletionStatusClass(): string {
    switch (this.project.currentProgress) {
      case 1: {
        return 'stage-completed-color';
      }
      case 0: {
        return 'stage-not-started-color';
      }
      case -1: {
        return '';
      }
      default: {
        return 'stage-in-progress-color';
      }
    }
  }

  private PopulateProject() {
    this.clientViewService.GetProjectDetails(this.projectId)
      .subscribe({
        next: (response: Project) => {
          this.project = new Project(response);
          this.projectHeader = this.project.name;
          this.titleService.setTitle(this.project.name + ' - Проекты');
        }
      })
  }
}
