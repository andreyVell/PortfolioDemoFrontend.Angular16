import { Component } from '@angular/core';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-employees-menu',
  templateUrl: './employees-menu.component.html',
  styleUrls: ['./employees-menu.component.css']
})
export class EmployeesMenuComponent extends ComponentWithAccessSegregation {

  constructor(protected override accessService: AccessService) {
    super(accessService);
  }  
}
