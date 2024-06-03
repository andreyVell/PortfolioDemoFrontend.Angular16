import { Injectable } from '@angular/core';
import { UserType } from '../models/Authentication/UserType';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AttachFileModel } from '../models/_ApiBase/AttachFileModel';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Employee } from '../models/Employees/Employee';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserDataService {
  private _authTokenName = 'authTokenConstruction';
  private _nameIdentifierClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
  private _loginClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
  private _roleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
  private _employeeIdClaimType = "CurrentUserEmployeeId";
  private _currentUserEmployeeShortInfo: Employee | null = null;
  public currentUserEmployeeShortInfoSubject: Subject<Employee> = new Subject<Employee>();


  constructor(private _httpClient: HttpClient) { }

  public initializeCurrentUserData(): void {
    this.populateCurrentUserShortInfoFromBackend();
  }

  public deInitializeCurrentUserData(): void {
    this._currentUserEmployeeShortInfo = null;
  }

  public get currentUserEmployeeShortInfo(): Employee | null {
    return this._currentUserEmployeeShortInfo;
  }

  public set currentUserEmployeeShortInfo(value: Employee | null) {
    this._currentUserEmployeeShortInfo = value;
  }

  public RemoveAuthToken(): void {
    localStorage.removeItem(this._authTokenName);
  }

  public postAuthTokenToLocalStorage(token: string): void {
    localStorage.setItem(this._authTokenName, token);
  }

  public getAuthTokenFromLocalStorage(): string | null {
    return localStorage.getItem(this._authTokenName);
  }

  public isCurrentUserLoggedIn(): boolean {
    return !!this.getAuthTokenFromLocalStorage();
  }

  public GetCurrentUserId(): string {
    let tokenInfo = this.GetCurrentUserTokenInfo();
    return tokenInfo ? tokenInfo[this._nameIdentifierClaimType] : '';
  }

  public GetCurrentUserEmployeeId(): string {
    let tokenInfo = this.GetCurrentUserTokenInfo();
    return tokenInfo ? tokenInfo[this._employeeIdClaimType] : '';
  }

  public IsCurrentUserIsUser(): boolean {
    return this.GetCurrentUserType() === UserType.User;
  }

  public IsCurrentUserIsClient(): boolean {
    let currentUserType = this.GetCurrentUserType();
    return currentUserType === UserType.ClientOrganization || currentUserType === UserType.ClientPerson;
  }

  public GetCurrentUserEmployee(): Observable<Employee> {
    return this._httpClient.get<Employee>(
      BackendApiEndpoints.get_curent_user_employee_endpoint
    );
  }

  public GetCurrentUserEmployeeShortInfo(): Observable<Employee> {
    return this._httpClient.get<Employee>(
      BackendApiEndpoints.get_curent_user_employee_short_info_endpoint
    );
  }

  public UpdateCurrentUserEmployeeShortInfo(updateModel: Employee): void {
    this.currentUserEmployeeShortInfo = new Employee(updateModel);
    this.currentUserEmployeeShortInfo.employeeSmallAvatar = this.currentUserEmployeeShortInfo.employeeAvatar;
    this.currentUserEmployeeShortInfoSubject.next(this.currentUserEmployeeShortInfo);
  }

  private GetCurrentUserType(): UserType {
    let tokenInfos = this.GetCurrentUserTokenInfo();
    if (tokenInfos) {
      let typeStr = tokenInfos[this._roleClaimType]
      switch (typeStr) {
        case 'User':
          return UserType.User;
        case 'Organization':
          return UserType.ClientOrganization;
        case 'Person':
          return UserType.ClientPerson;
      }
    }
    return UserType.None;
  }

  private GetCurrentUserTokenInfo(): any {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getAuthTokenFromLocalStorage() ?? "");
    return decodedToken;
  }

  private populateCurrentUserShortInfoFromBackend(): void {
    this.GetCurrentUserEmployeeShortInfo()
      .subscribe({
        next: (response: Employee) => {
          this._currentUserEmployeeShortInfo = new Employee(response);
          this.currentUserEmployeeShortInfoSubject.next(this._currentUserEmployeeShortInfo);
        }
      })
  }
}
