import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvetonRoleCreatorComponent } from './aveton-role-creator.component';

describe('AvetonRoleCreatorComponent', () => {
  let component: AvetonRoleCreatorComponent;
  let fixture: ComponentFixture<AvetonRoleCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvetonRoleCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvetonRoleCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
