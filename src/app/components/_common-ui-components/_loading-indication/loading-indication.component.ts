import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-indication',
  templateUrl: './loading-indication.component.html',
  styleUrls: ['./loading-indication.component.css']
})
export class LoadingIndicationComponent {
  @Input() indicationColor: string = '';
  @Input() height: number = 80;
  @Input() width: number = 80;

  public GetClassName() {
    if (this.indicationColor == 'white')
      return 'lds-dual-ring-white';
    return 'lds-dual-ring-main';
  }
}
