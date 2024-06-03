import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/models/Project/Project';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { ItemsCollectionResponce } from 'src/app/models/_ApiBase/ItemsCollectionResponce';
import { ComponentWithPagination } from 'src/app/models/_Pagging/ComponentWithPagination';
import { PageSettings } from 'src/app/models/_Pagging/PageSetting';
import { ClientViewService } from 'src/app/services/client-view.service';

@Component({
  selector: 'app-client-view-main-page',
  templateUrl: './client-view-main-page.component.html',
  styleUrls: ['./client-view-main-page.component.css']
})
export class ClientViewMainComponent extends AdaptiveComponent implements ComponentWithPagination, OnInit {
  pageSettings: PageSettings = new PageSettings(this, true);
  projects: Array<Project> = [];

  constructor(
    private clientViewService: ClientViewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private locale: string) {
    super();
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

  private PopulateProjects() {
    this.clientViewService.GetProjectsPage(this.pageSettings)
      .subscribe({
        next: (response: ItemsCollectionResponce<Project>) => {
          this.projects = response.items
            .map(project => new Project(project))
            .sort((a, b) => (a.createdOn < b.createdOn) ? 1 : ((b.createdOn < a.createdOn) ? -1 : 0));;
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
      let columnsNumber = Math.floor((bodyWidth - 20) / 368);
      let targetWidth = 368 * columnsNumber - 20;
      if (targetContainer && targetContainer.style.width != targetWidth + 'px') {
        targetContainer.style.width = targetWidth + 'px';
        targetContainer.style.maxWidth = targetWidth + 'px';
      }
    }
  }
}
