import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicationComponent } from './loading-indication.component';

describe('LoadingIndicationComponent', () => {
  let component: LoadingIndicationComponent;
  let fixture: ComponentFixture<LoadingIndicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingIndicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingIndicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
