import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';


const BADGE_CONTENT_CLASS = 'aveton-badge';
const BADGE_REVERSE_CONTENT_CLASS = 'aveton-badge-reverse';

@Directive({
  selector: '[avetonBadge]'
})
export class AvetonBadgeDirective implements OnInit {
  @Input('avetonBadge')
  get content(): string | number | undefined | null {
    return this._content;
  }
  set content(newContent: string | number | undefined | null) {
    this._updateRenderedContent(newContent);
  }
  private _content: string | number | undefined | null;
  @Input('isColorReverse')
  get isColorReverse(): boolean {
    return this._isColorReverse;
  }
  set isColorReverse(value: boolean) {
    this._isColorReverse = value;
  }
  private _isColorReverse: boolean = false;
  private _badgeElement: HTMLElement | undefined;
  private _isInitialized = false;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) { }

  public ngOnInit(): void {
    this._clearExistingBadges();

    if (this.content && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
      this._updateRenderedContent(this.content);
    }

    this._isInitialized = true;
  }

  getBadgeElement(): HTMLElement | undefined {
    return this._badgeElement;
  }


  private _updateRenderedContent(newContent: string | number | undefined | null): void {
    const newContentNormalized: string = `${newContent ?? ''}`.trim();
    if (this._isInitialized && newContentNormalized && !this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
    }

    if (this._badgeElement) {
      this._badgeElement.textContent = newContentNormalized;
    }

    this._content = newContentNormalized;
  }

  private _createBadgeElement(): HTMLElement {
    const badgeElement = this._renderer.createElement('span');

    badgeElement.setAttribute('aria-hidden', 'true');
    badgeElement.classList.add(BADGE_CONTENT_CLASS);
    if (this._isColorReverse) {
      badgeElement.classList.add(BADGE_REVERSE_CONTENT_CLASS);
    }

    this._elementRef.nativeElement.appendChild(badgeElement);

    return badgeElement;
  }

  private _clearExistingBadges() {
    const badges = this._elementRef.nativeElement.querySelectorAll(
      `:scope > .${BADGE_CONTENT_CLASS}`,
    );
    for (const badgeElement of Array.from(badges)) {
      if (badgeElement !== this._badgeElement) {
        (badgeElement as HTMLElement).remove();
      }
    }
  }

}
