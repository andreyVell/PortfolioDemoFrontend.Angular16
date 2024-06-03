import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { Employee } from '../models/Employees/Employee';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { AttachFileModel } from '../models/_ApiBase/AttachFileModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService extends BaseCrudService<Employee, Employee, Employee>{
  override typeName: string = 'Employees';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }  

  public GetEmployeeSmallAvatar(employeeId: string): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_employee_small_avatar_endpoint(employeeId)
    );
  }

  public GetEmployeeBigAvatar(employeeId: string): Observable<AttachFileModel> {
    return this.httpClient.get<AttachFileModel>(
      BackendApiEndpoints.get_employee_big_avatar_endpoint(employeeId)
    );
  }
}
