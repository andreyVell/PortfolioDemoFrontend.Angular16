import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUserDataService } from '../services/current-user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AccessToLoginPageGuard  {
  constructor(private currentUserDataService: CurrentUserDataService,
    private router: Router,
    private snackBar: MatSnackBar) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.currentUserDataService.isCurrentUserLoggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    else {
      return true;
    }
  }

}
