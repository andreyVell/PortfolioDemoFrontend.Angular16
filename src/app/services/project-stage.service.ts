import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { ProjectStage } from '../models/ProjectStage/ProjectStage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';

@Injectable({
  providedIn: 'root'
})
export class ProjectStageService extends BaseCrudService<ProjectStage, ProjectStage, ProjectStage>  {
  override typeName: string = 'ProjectStages';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  public GetAllForProject(projectId: string, filterString: string): Observable<Array<ProjectStage>> {
    return this.httpClient.get<Array<ProjectStage>>
      (BackendApiEndpoints.get_all_stages_for_project_endpoint + `/${projectId}`, {
        params: {
          filterString: filterString ?? ""
        }
      });
  }

  public GetProjectName(projectStageId: string): Observable<any> {
    return this.httpClient.get<any>(
      BackendApiEndpoints.get_project_name_of_project_stage_endpoint(projectStageId)
    );
  }
}
