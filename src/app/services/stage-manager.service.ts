import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { StageManager } from '../models/StageManager/StageManager';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StageManagerService extends BaseCrudService<StageManager, StageManager, StageManager>  {
  override typeName: string = 'StageManagers';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
