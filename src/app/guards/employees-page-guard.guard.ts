import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentWithAccessSegregation } from '../models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from '../services/access.service';
import { Employee } from '../models/Employees/Employee';
import { Position } from '../models/Position/Position';
import { Division } from '../models/Division/Division';
import { AvetonRole } from '../models/AvetonRole/AvetonRole';
import { CurrentUserDataService } from '../services/current-user-data.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesPageGuardGuard extends ComponentWithAccessSegregation  {
  constructor(private currentUserDataService: CurrentUserDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    protected override accessService: AccessService) {
      super(accessService);
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.currentUserDataService.isCurrentUserLoggedIn()) {
      if (this.currentUserDataService.IsCurrentUserIsUser()) {
        if (this.HasReadAccessTo('Employee')){
          return true;
        }
        if (this.HasReadAccessTo('Position')){
          this.router.navigate(['/Employees/Positions']);
          return false;
        }
        if (this.HasReadAccessTo('Division')){
          this.router.navigate(['/Employees/Divisions']);
          return false;
        }
        if (this.HasReadAccessTo('AvetonRole')){
          this.router.navigate(['/Employees/Roles']);
          return false;
        }        
        return true;
      }
      else {
        this.snackBar.open("Доступ запрещён", 'Ок', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 10000,
          panelClass: ['snack-bar-error']
        });
        this.router.navigate(['/ClientView']);
        return false;
      }
    }
    else {
      this.snackBar.open("Доступ запрещён", 'Ок', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 10000,
        panelClass: ['snack-bar-error']
      });
      this.router.navigate(['/Login']);
      return false;
    }
  }
  
}
