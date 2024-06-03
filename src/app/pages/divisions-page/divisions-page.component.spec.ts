import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsPageComponent } from './divisions-page.component';

describe('DivisionsPageComponent', () => {
  let component: DivisionsPageComponent;
  let fixture: ComponentFixture<DivisionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
