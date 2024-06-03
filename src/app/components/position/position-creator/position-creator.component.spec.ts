import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionCreatorComponent } from './position-creator.component';

describe('PositionCreatorComponent', () => {
  let component: PositionCreatorComponent;
  let fixture: ComponentFixture<PositionCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
