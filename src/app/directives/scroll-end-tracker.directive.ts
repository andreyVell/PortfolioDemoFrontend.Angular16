import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[ScrollEndTracker]'
})
export class ScrollEndTrackerDirective {
  @Input() pixelsToScrollBottomToEmitEvent = 120;
  @Output() scrollEnd = new EventEmitter<void>();
  constructor(private el: ElementRef) { }

  @HostListener('scroll', ['$event.target'])
  onScroll(target: HTMLElement): void {
    const scrollPosition = target.scrollHeight - Math.abs(target.scrollTop);
    const elementHeight = target.clientHeight;
    if (scrollPosition - elementHeight <= this.pixelsToScrollBottomToEmitEvent) {
      this.scrollEnd.emit();
    }
  }
}
