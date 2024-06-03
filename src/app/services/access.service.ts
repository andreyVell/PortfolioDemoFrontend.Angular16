import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AvetonRoleAccess } from '../models/AvetonRole/AvetonRoleAccess';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { EntityAction } from '../models/AvetonRole/EntityAction';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private _entityNames: Array<string> = [
    "AvetonRole",
    "Client",
    "Person",
    "Organization",
    "Division",
    "Employee",
    "AvetonUser",
    "Position",
    "Project",
    "StageReport",
    "StageReportAttachedFile",
    "ProjectStage",
    "StageManager",
    "DivisionContractor",
    "Chat",
    "ChatMember",
    "ChatMessage",
    "ChatMessageAttachedFile",
    "ChatMessageViewedInfo"
  ];
  private _accesses: { [key: string]: { [key: number]: boolean } } = {};

  constructor(private httpClient: HttpClient) {

  }

  public HasReadAccessTo(entityName: string) {
    if (typeof this._accesses[entityName] !== "undefined"
      && typeof this._accesses[entityName][EntityAction.Read] !== "undefined") {
      return this._accesses[entityName][EntityAction.Read];
    }
    return false;
  }

  public HasUpdateAccessTo(entityName: string) {
    if (typeof this._accesses[entityName] !== "undefined"
      && typeof this._accesses[entityName][EntityAction.Update] !== "undefined") {
      return this._accesses[entityName][EntityAction.Update]
    }
    return false;
  }

  public HasCreateAccessTo(entityName: string) {
    if (typeof this._accesses[entityName] !== "undefined"
      && typeof this._accesses[entityName][EntityAction.Create] !== "undefined") {
      return this._accesses[entityName][EntityAction.Create]
    }
    return false;
  }

  public HasDeleteAccessTo(entityName: string) {
    if (typeof this._accesses[entityName] !== "undefined"
      && typeof this._accesses[entityName][EntityAction.Delete] !== "undefined") {
      return this._accesses[entityName][EntityAction.Delete]
    }
    return false;
  }

  public PopulateAccessesForCurrentUserObservable(): Observable<boolean> {
    //если доступы не были получены до этого, то загружаем

    if (Object.keys(this._accesses).length === 0) {
      return this.httpClient.post<AvetonRoleAccess[]>
        (BackendApiEndpoints.get_curent_user_accesses_endpoint, this._entityNames)
        .pipe(
          map((response: AvetonRoleAccess[]) => {
            response.forEach((access: AvetonRoleAccess) => {
              if (typeof this._accesses[access.entityName] !== "undefined") {
                this._accesses[access.entityName][access.entityAction] = access.isAllowed;
              }
              else {
                this._accesses[access.entityName] = {};
                this._accesses[access.entityName][access.entityAction] = access.isAllowed;
              }
            })
            return true;
          })
        );
    }
    else {
      return of(true);
    }

  }
}
