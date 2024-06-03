import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import FormValidation from 'src/app/helpers/FormValidation';
import { UserAuthenticationResponce } from 'src/app/models/Authentication/UserAuthenticationResponse';
import { UserType } from 'src/app/models/Authentication/UserType';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClientAuthenticationRequest } from 'src/app/models/Authentication/ClientAuthenticationRequest';
import { CurrentUserDataService } from 'src/app/services/current-user-data.service';
import { ClientViewChatService } from 'src/app/services/client-view-chat.service';

@Component({
  selector: 'app-client-view-login-page',
  templateUrl: './client-view-login-page.component.html',
  styleUrls: ['./client-view-login-page.component.css']
})
export class ClientViewLoginPageComponent {
  public iconPasswordClass: string = 'fa fa-eye p-2';
  public inputPasswordType: string = 'password';
  public loginForm!: FormGroup;
  public currentClientType: UserType = UserType.ClientPerson;
  private loginData = new ClientAuthenticationRequest();
  private inputPasswordTypeIsText: boolean = false;
  public isLoging: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private clientViewChatService: ClientViewChatService,
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
      this.loginData.login = this.loginForm.value.username;
      this.loginData.password = this.loginForm.value.password;
      this.loginData.clientType = this.currentClientType;
      this.login();
    }
    else {
      FormValidation.validateAllFormFields(this.loginForm);
    }
  }

  private login() {
    this.authService.ClientLogin(this.loginData).subscribe({
      next: (tokenResponse: UserAuthenticationResponce) => {
        if (tokenResponse) {
          this.InitializeClintWork(tokenResponse.token);

          this.router.navigate(['ClientView']);
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
  public HideShowPass() {
    this.inputPasswordTypeIsText ? this.inputPasswordType = 'password' : this.inputPasswordType = 'text';
    this.inputPasswordTypeIsText ? this.iconPasswordClass = 'fa fa-eye p-2' : this.iconPasswordClass = 'fa fa-eye-slash p-2';
    this.inputPasswordTypeIsText = !this.inputPasswordTypeIsText;
  }

  private InitializeClintWork(token: string) {
    this.currentUserDataService.postAuthTokenToLocalStorage(token);
    this.clientViewChatService.InitializeChats();
  }
}
