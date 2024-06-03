import { AfterViewInit, Directive, EventEmitter, Input, Output } from '@angular/core';
import { ChatMessage } from '../models/Chat/ChatMessage';

@Directive({
  selector: '[isChatMessageRendered]'
})
export class IsChatMessageRenderedDirective implements AfterViewInit {
  @Output() messageRendered = new EventEmitter<void>();

  constructor() { }

  ngAfterViewInit(): void {
    this.messageRendered.emit();
  }
}
