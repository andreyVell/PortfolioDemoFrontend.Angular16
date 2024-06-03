import { Injectable } from '@angular/core';
import { DivisionContractor } from '../models/DivisionContractor/DivisionContractor';
import { BaseCrudService } from './_base-crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DivisionContractorService extends BaseCrudService<DivisionContractor, DivisionContractor, DivisionContractor>  {
  override typeName: string = 'DivisionContractors';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
