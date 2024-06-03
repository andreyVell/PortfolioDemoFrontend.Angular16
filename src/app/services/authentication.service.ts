import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendApiEndpoints } from '../helpers/BackendApiEndpoints';
import { UserAuthenticationResponce } from '../models/Authentication/UserAuthenticationResponse';
import { UserAuthenticationRequest } from '../models/Authentication/UserAuthenticationRequest';
import { ClientAuthenticationRequest } from '../models/Authentication/ClientAuthenticationRequest';
import { ChatService } from './chat.service';
import { CurrentUserDataService } from './current-user-data.service';
import { ClientViewChatService } from './client-view-chat.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private chatsService: ChatService,
    private clientViewChatService: ClientViewChatService,
    private currentUserDataService: CurrentUserDataService) {

  }

  public Login(user: UserAuthenticationRequest): Observable<UserAuthenticationResponce> {
    return this.httpClient.post<UserAuthenticationResponce>(
      BackendApiEndpoints.user_authentication_endpoint,
      user
    );
  }

  public ClientLogin(client: ClientAuthenticationRequest): Observable<UserAuthenticationResponce> {
    return this.httpClient.post<UserAuthenticationResponce>(
      BackendApiEndpoints.client_authentication_endpoint,
      client
    );
  }

  public Logout() {
    if (this.currentUserDataService.IsCurrentUserIsClient()) {
      this.clientViewChatService.DeInitializeChats();
    }
    if (this.currentUserDataService.IsCurrentUserIsUser()) {
      this.currentUserDataService.deInitializeCurrentUserData();
      this.chatsService.DeInitializeChats();
    }
    this.currentUserDataService.RemoveAuthToken();
    this.router.navigate(['Login']);
  }
}