import { Component, Input } from '@angular/core';
import { ComponentWithAccessSegregation } from 'src/app/models/_AccessControl/ComponentWithAccessSegregation';
import { AccessService } from 'src/app/services/access.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent extends ComponentWithAccessSegregation {
  @Input() IsExpanded: boolean = false;

  constructor(protected override accessService: AccessService,
    public chatService: ChatService) {
    super(accessService);

  }
}
