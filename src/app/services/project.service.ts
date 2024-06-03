import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { Project } from '../models/Project/Project';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseCrudService<Project, Project, Project>  {
  override typeName: string = 'Projects';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
