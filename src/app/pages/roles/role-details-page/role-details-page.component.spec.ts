import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDetailsPageComponent } from './role-details-page.component';

describe('RoleDetailsPageComponent', () => {
  let component: RoleDetailsPageComponent;
  let fixture: ComponentFixture<RoleDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleDetailsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
