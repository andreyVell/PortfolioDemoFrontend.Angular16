import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvetonRoleSelectorComponent } from './aveton-role-selector.component';

describe('AvetonRoleSelectorComponent', () => {
  let component: AvetonRoleSelectorComponent;
  let fixture: ComponentFixture<AvetonRoleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvetonRoleSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvetonRoleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
