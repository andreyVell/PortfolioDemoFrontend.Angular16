import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { StageReport } from '../models/StageReport/StageReport';
import { CreateStageReport } from '../models/StageReport/CreateStageReport';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StageReportService extends BaseCrudService<StageReport, CreateStageReport, StageReport>  {
  override typeName: string = 'StageReports';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
