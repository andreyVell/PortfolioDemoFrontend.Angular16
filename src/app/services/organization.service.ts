import { Injectable } from '@angular/core';
import { Organization } from '../models/Client/Organization';
import { BaseCrudService } from './_base-crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends BaseCrudService<Organization, Organization, Organization> {
  override typeName: string = 'Organizations';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
