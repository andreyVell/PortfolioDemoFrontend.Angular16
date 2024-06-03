import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallProjectCardComponent } from './small-project-card.component';

describe('SmallProjectCardComponent', () => {
  let component: SmallProjectCardComponent;
  let fixture: ComponentFixture<SmallProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallProjectCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
