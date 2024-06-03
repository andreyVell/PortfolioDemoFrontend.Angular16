import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[isElementInViewTracker]'
})
export class IsElementInViewTrackerDirective implements OnInit {
  @Output() inView = new EventEmitter<void>();
  constructor(private el: ElementRef) { }

  public ngOnInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.inView.emit();
          observer.unobserve(this.el.nativeElement);
        }
      })
    })

    observer.observe(this.el.nativeElement);
  }
}
