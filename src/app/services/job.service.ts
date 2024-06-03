import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { Job } from '../models/Job/Job';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseCrudService<Job, Job, Job> {
  override typeName: string = 'Jobs';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
