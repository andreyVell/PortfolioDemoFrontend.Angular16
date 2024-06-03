import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountPageComponent } from './personal-account-page.component';

describe('PersonalAccountPageComponent', () => {
  let component: PersonalAccountPageComponent;
  let fixture: ComponentFixture<PersonalAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalAccountPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
