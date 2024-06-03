import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageSettings } from '../models/_Pagging/PageSetting';
import { ItemsCollectionResponce } from '../models/_ApiBase/ItemsCollectionResponce';
import { Project } from '../models/Project/Project';
import { Observable } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { ProjectStage } from '../models/ProjectStage/ProjectStage';
import { AttachFileModel } from '../models/_ApiBase/AttachFileModel';

@Injectable({
  providedIn: 'root'
})
export class ClientViewService {

  constructor(private httpClient: HttpClient) {
  }


  public GetProjectsPage(pageSettings: PageSettings): Observable<ItemsCollectionResponce<Project>> {
    return this.httpClient.get<ItemsCollectionResponce<Project>>
      (BackendApiEndpoints.get_client_view_projects_page_endpoint, {
        params: {
          startIndex: pageSettings.curentPage * pageSettings.itemsPerPage,
          itemsPerPage: pageSettings.itemsPerPage,
          filterString: pageSettings.currentFilterString
        }
      });
  }

  public GetProjectDetails(modelId: string): Observable<Project> {
    return this.httpClient.get<Project>(
      BackendApiEndpoints.get_client_view_project_details_page_endpoint + `/${modelId}`
    );
  }

  public GetAllStagesForProject(projectId: string, filterString: string): Observable<Array<ProjectStage>> {
    return this.httpClient.get<Array<ProjectStage>>
      (BackendApiEndpoints.get_client_view_project_stages_endpoint + `/${projectId}`, {
        params: {
          filterString: filterString ?? ""
        }
      });
  }

  public GetProjectNameForStage(projectStageId: string): Observable<string> {
    return this.httpClient.get<string>(
      BackendApiEndpoints.get_client_view_project_name_for_stage_endpoint + `/${projectStageId}`
    );
  }

  public GetProjectStageDetails(projectStageId: string): Observable<ProjectStage> {
    return this.httpClient.get<ProjectStage>(
      BackendApiEndpoints.get_client_view_project_stage_details_endpoint + `/${projectStageId}`
    );
  }

  public GetStageReportAttachedFileContent(stageReportAttachedFileId: string, isImageMedium: boolean = false): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_client_view_stage_report_attached_file_content_endpoint + `/${stageReportAttachedFileId}`, {
      params: {
        isImageMedium: isImageMedium
      }
    }
    );
  }
}
