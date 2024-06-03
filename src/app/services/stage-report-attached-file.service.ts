import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { StageReportAttachedFile } from '../models/StageReportAttachedFile/StageReportAttachedFile';
import { CreateStageReportAttachedFileRequest } from '../models/StageReportAttachedFile/CreateStageReportAttachedFileRequest';
import { HttpClient } from '@angular/common/http';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { AttachFileModel } from '../models/_ApiBase/AttachFileModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StageReportAttachedFileService extends BaseCrudService<StageReportAttachedFile, CreateStageReportAttachedFileRequest, StageReportAttachedFile> {
  override typeName: string = 'StageReportAttachedFiles';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  public GetFileContent(modelId: string, isImageMedium: boolean = false): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_attached_file_content_endpoint(modelId), {
      params: {
        isImageMedium: isImageMedium
      }
    }
    );
  }
}
