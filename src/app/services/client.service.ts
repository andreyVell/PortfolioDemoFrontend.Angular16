import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { Client } from '../models/Client/Client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseCrudService<Client, Client, Client> {
  override typeName: string = 'Clients';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
