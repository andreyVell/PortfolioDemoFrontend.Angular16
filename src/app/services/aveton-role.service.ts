import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { AvetonRole } from '../models/AvetonRole/AvetonRole';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvetonRoleService extends BaseCrudService<AvetonRole,AvetonRole,AvetonRole>  {
  override typeName: string = 'AvetonRoles';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
