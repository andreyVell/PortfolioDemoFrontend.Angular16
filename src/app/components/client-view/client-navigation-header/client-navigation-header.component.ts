import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClientViewChatService } from 'src/app/services/client-view-chat.service';

@Component({
  selector: 'app-client-navigation-header',
  templateUrl: './client-navigation-header.component.html',
  styleUrls: ['./client-navigation-header.component.css']
})
export class ClientNavigationHeaderComponent extends AdaptiveComponent {
  @Input() isSarchFieldVisible: boolean = false;
  @Input() searchFieldPlaceHolder: string = '';
  @Output() searchFieldContentChanged: EventEmitter<string> = new EventEmitter();
  @Output() searchFieldEnterPressed: EventEmitter<void> = new EventEmitter();
  @Output() searchFieldEscPressed: EventEmitter<void> = new EventEmitter();

  constructor(
    private authService: AuthenticationService,
    public clientViewChatService: ClientViewChatService) {
    super();
  }

  public signOutClick() {
    this.authService.Logout();
  }

  public onSearchFieldContentChanged(inputText: string) {
    this.searchFieldContentChanged.emit(inputText);
  }

  public SearchFieldPressEnter() {
    this.searchFieldEnterPressed.emit();
  }
  public SearchFieldPressEsc() {
    this.searchFieldEscPressed.emit();
  }
}
