import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponseError } from '../models/_ApiBase/ApiResponseError';
import { CurrentUserDataService } from '../services/current-user-data.service';

@Injectable()
export class HttpErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private currentUserDataService: CurrentUserDataService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.currentUserDataService.getAuthTokenFromLocalStorage();
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: 'Bearer ' + token },
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            if (this.currentUserDataService.IsCurrentUserIsUser()) {
              this.UserSessionExpired();
            }
            if (this.currentUserDataService.IsCurrentUserIsClient()) {
              this.ClientSessionExpired();
            }

          };
          const apiError: ApiResponseError = err.error;
          if (apiError.errorMessage) {
            this.snackBar.open('Ошибка: ' + apiError.errorMessage, 'Ок', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 4000,
              panelClass: ['snack-bar-error']
            });
          }
          else {
            if (err.status != 404)
              this.snackBar.open('Ошибка: Что-то пошло не так', 'Ок', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 4000,
                panelClass: ['snack-bar-error']
              });
          }
        }
        return throwError(() => new Error(err));
      })
    );
  }

  private UserSessionExpired(): void {
    this.SessionExpired();
    this.router.navigate(['/Login']);
  }

  private ClientSessionExpired(): void {
    this.SessionExpired();
    this.router.navigate(['/ClientView/Login']);
  }

  private SessionExpired(): void {
    this.snackBar.open('Ваша сессия истекла, пожалуйста, войдите снова', 'Войти', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3600000,
      panelClass: ['snack-bar-error']
    });
    this.authService.Logout();
  }

}
