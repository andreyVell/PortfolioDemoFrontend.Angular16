import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuthenticationRequest } from 'src/app/models/Authentication/UserAuthenticationRequest';
import { UserAuthenticationResponce } from 'src/app/models/Authentication/UserAuthenticationResponse';
import FormValidation from 'src/app/helpers/FormValidation';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserType } from 'src/app/models/Authentication/UserType';
import { AccessService } from 'src/app/services/access.service';
import { ChatService } from 'src/app/services/chat.service';
import { CurrentUserDataService } from 'src/app/services/current-user-data.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public iconPasswordClass: string = 'fa fa-eye p-2';
  public inputPasswordType: string = 'password';
  private inputPasswordTypeIsText: boolean = false;
  public loginForm!: FormGroup;
  private loginData = new UserAuthenticationRequest();
  public isLoging: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accessService: AccessService,
    private chatService: ChatService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private currentUserDataService: CurrentUserDataService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmitLoginForm() {
    if (this.loginForm.valid) {
      this.isLoging = true;
      this.loginData.Login = this.loginForm.value.username;
      this.loginData.Password = this.loginForm.value.password;
      this.login();
    }
    else {
      FormValidation.validateAllFormFields(this.loginForm);
    }
  }

  private login() {
    this.authService.Login(this.loginData).subscribe({
      next: (tokenResponse: UserAuthenticationResponce) => {
        if (tokenResponse) {
          this.InitializeUserWork(tokenResponse.token)
          this.router.navigate(['']);
          this.snackBar.open(
            "Вы вошли в систему",
            "Ок", {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 4000,
            panelClass: ['snack-bar-success']
          });
        }
      },
      error: (err: any) => {
        this.isLoging = false;
      }
    });
  }

  private InitializeUserWork(token: string) {
    this.currentUserDataService.postAuthTokenToLocalStorage(token);
    this.currentUserDataService.initializeCurrentUserData();
    this.accessService.PopulateAccessesForCurrentUserObservable()
      .subscribe({
        next: (response: boolean) => {
          if (response) {
            if (this.accessService.HasReadAccessTo('Chat')){
              this.chatService.InitializeChats();
            }            
          }
        },
        error: () => {

        }
      });
  }


  public HideShowPass() {
    this.inputPasswordTypeIsText ? this.inputPasswordType = 'password' : this.inputPasswordType = 'text';
    this.inputPasswordTypeIsText ? this.iconPasswordClass = 'fa fa-eye p-2' : this.iconPasswordClass = 'fa fa-eye-slash p-2';
    this.inputPasswordTypeIsText = !this.inputPasswordTypeIsText;
  }
}
