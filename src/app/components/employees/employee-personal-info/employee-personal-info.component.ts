import { Component, Input } from '@angular/core';
import { Employee } from 'src/app/models/Employees/Employee';
import { PositionSelectorComponent } from '../../position/position-selector/position-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { Position } from 'src/app/models/Position/Position';
import { DivisionSelectorComponent } from '../../division/division-selector/division-selector.component';
import { Division } from 'src/app/models/Division/Division';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';

@Component({
  selector: 'app-employee-personal-info',
  templateUrl: './employee-personal-info.component.html',
  styleUrls: ['./employee-personal-info.component.css']
})
export class EmployeePersonalInfoComponent extends ComponentWithAccessSegregation {
  @Input() employee!: Employee;

  constructor(    
    private dialog: MatDialog,
    protected override accessService: AccessService
  ){
    super(accessService);
  }

  public SelectPosition(){
    const dialogFormRef = this.dialog.open(PositionSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedPosition: Position) => {
        if (selectedPosition) {          
          this.employee.lastJob!.positionId = selectedPosition.id;
          this.employee.lastJob!.positionName = selectedPosition.name;
        }
      },
    });
  }

  public SelectDivision(){
    const dialogFormRef = this.dialog.open(DivisionSelectorComponent);
    dialogFormRef.afterClosed().subscribe({
      next: (selectedDivision: Division) => {
        if (selectedDivision) {          
          this.employee.lastJob!.divisionId = selectedDivision.id;
          this.employee.lastJob!.divisionName = selectedDivision.name;
        }
      },
    });
  }
}
