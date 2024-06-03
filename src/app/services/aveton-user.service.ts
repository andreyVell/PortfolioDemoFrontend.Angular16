import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { AvetonUser } from '../models/AvetonUser/AvetonUser';
import { HttpClient } from '@angular/common/http';
import { NewAvetonUserRequest } from '../models/AvetonUser/NewAvetonUserRequest';
import { Observable } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';

@Injectable({
  providedIn: 'root'
})
export class AvetonUserService extends BaseCrudService<AvetonUser, NewAvetonUserRequest, AvetonUser> {
  override typeName: string = 'AvetonUsers';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }


  public DeleteRole(roleId: string, userId: string): Observable<any> {
    return this.httpClient.delete<any>(
      BackendApiEndpoints.delete_aveton_user_role_endpoint(userId, roleId)
    );
  }

  public GetAllRoles(userId: string): Observable<any> {
    return this.httpClient.get<any>(
      BackendApiEndpoints.aveton_user_get_all_roles_endpoint(userId));
  }

  public AddSelectedRoleToUser(roleId: string, userId: string): Observable<any> {
    return this.httpClient.post<any>(
      BackendApiEndpoints.add_selected_role_to_user_endpoint(userId, roleId),
      null
    );
  }
}
