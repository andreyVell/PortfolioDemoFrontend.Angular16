import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserDataService } from '../services/current-user-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserOnlyGuard  {
  constructor(private currentUserDataService: CurrentUserDataService,
    private router: Router,
    private snackBar: MatSnackBar) {

  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.currentUserDataService.isCurrentUserLoggedIn()) {
      if (this.currentUserDataService.IsCurrentUserIsUser()) {
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
