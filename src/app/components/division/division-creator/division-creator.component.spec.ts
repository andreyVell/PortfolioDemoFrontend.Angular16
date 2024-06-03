import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionCreatorComponent } from './division-creator.component';

describe('DivisionCreatorComponent', () => {
  let component: DivisionCreatorComponent;
  let fixture: ComponentFixture<DivisionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
