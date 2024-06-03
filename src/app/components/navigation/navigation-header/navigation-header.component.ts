import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { AccessService } from 'src/app/services/access.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';
import { CurrentUserDataService } from 'src/app/services/current-user-data.service';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.css']
})
export class NavigationHeaderComponent extends AdaptiveComponent implements OnInit  {
  @Input() isSarchFieldVisible : boolean = false;
  @Input() searchFieldPlaceHolder: string = '';
  @Output() searchFieldContentChanged : EventEmitter<string> = new EventEmitter();
  @Output() searchFieldEnterPressed: EventEmitter<void> = new EventEmitter();
  @Output() searchFieldEscPressed: EventEmitter<void> = new EventEmitter();
  public defaultImageSrc: string = 'assets/images/avatar-default-small.png';
  
  constructor(
    private _authService: AuthenticationService,
    public currentUserDataService: CurrentUserDataService,
    public chatService: ChatService) 
  { 
    super();
  }

  public ngOnInit(): void {
    
  }

  public signOutClick() {
    this._authService.Logout();
  }

  public onSearchFieldContentChanged(inputText: string){
    this.searchFieldContentChanged.emit(inputText);
  }

  public SearchFieldPressEnter(){
    this.searchFieldEnterPressed.emit();
  }
  public SearchFieldPressEsc(){
    this.searchFieldEscPressed.emit();
  }
}
