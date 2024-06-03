import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectCreatorComponent } from 'src/app/components/project/project-creator/project-creator.component';
import { Project } from 'src/app/models/Project/Project';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { AccessService } from 'src/app/services/access.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.css']
})
export class ProjectsPageComponent extends ComponentWithAccessSegregation implements ComponentWithPagination, OnInit {
  pageSettings: PageSettings = new PageSettings(this, true);
  projects: Array<Project> = [];

  constructor(
    private projectService: ProjectService,
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

  public ngOnInit(): void {
    const body = document.body as HTMLDivElement;
    const observer = new ResizeObserver(entries => {
      this.ReCalcControllingContainerWidth();
    });
    observer.observe(body);
  }

  public Refresh() {
    this.PopulateProjects();
  }

  public CreateProject() {
    const dialogFormRef = this.dialog.open(ProjectCreatorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (createdProject: Project) => {
        if (createdProject) {
          this.projects.unshift(createdProject);
          this.pageSettings.totalItems++;
          if (this.projects.length >= this.pageSettings.itemsPerPage) {
            this.projects.pop();
          }
        }
      }
    });
  }

  private PopulateProjects() {
    this.projectService.GetPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Project>) => {
          this.projects = response.items
            .map(project => new Project(project));
          this.pageSettings.totalItems = response.totalItems;
        }
      });
  }

  private ReCalcControllingContainerWidth() {
    //получаем высоту рабочей области    
    let body = document.body as HTMLDivElement;
    if (body) {
      //из этой высоты вычитаем высоту кнопки и табов
      const targetContainer = document.querySelector('.project-page-controlling-container') as HTMLDivElement;
      let bodyWidth = body.clientWidth;
      let columnsNumber = Math.floor((bodyWidth - 56 - 20) / 368);
      let targetWidth = 368 * columnsNumber - 20;
      if (targetContainer && targetContainer.style.width != targetWidth + 'px') {
        targetContainer.style.width = targetWidth + 'px';
        targetContainer.style.maxWidth = targetWidth + 'px';
      }
    }
  }
}
