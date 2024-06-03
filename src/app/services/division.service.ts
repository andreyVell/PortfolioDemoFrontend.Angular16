import { Injectable } from '@angular/core';
import { Division } from '../models/Division/Division';
import { BaseCrudService } from './_base-crud.service';
import { HttpClient } from '@angular/common/http';
import { ItemsCollectionResponce } from '../models/_ApiBase/ItemsCollectionResponce';
import { Observable } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';

@Injectable({
  providedIn: 'root'
})
export class DivisionService extends BaseCrudService<Division, Division, Division> {
  override typeName: string = 'Divisions'; 

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }

  public GetNestedListDivisions(filterString: string): Observable<Division[]> {
    return this.httpClient.get<Division[]>
      (BackendApiEndpoints.get_nested_list_divisions_endpoint, {
        params: {          
          filterString: filterString
        }
      });
  }


  public GetParentDivisions(): Observable<ItemsCollectionResponce<Division>> {
    return this.httpClient.get<ItemsCollectionResponce<Division>>
      (BackendApiEndpoints.get_parent_divisions_endpoint);
  }

  public GetChildDivisions(parentDivision: Division): Observable<ItemsCollectionResponce<Division>> {
    return this.httpClient.get<ItemsCollectionResponce<Division>>
      (BackendApiEndpoints.get_child_divisions_endpoint(parentDivision.id));
  }
}
