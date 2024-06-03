import { Injectable } from '@angular/core';
import { Person } from '../models/Client/Person';
import { BaseCrudService } from './_base-crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseCrudService<Person, Person, Person> {
  override typeName: string = 'Persons';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
