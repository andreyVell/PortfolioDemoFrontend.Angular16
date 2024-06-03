import { Injectable } from '@angular/core';
import { BaseCrudService } from './_base-crud.service';
import { Position } from '../models/Position/Position';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PositionService extends BaseCrudService<Position, Position, Position> {
  override typeName: string = 'Positions';

  constructor(protected override httpClient: HttpClient) {
    super(httpClient);
  }
}
