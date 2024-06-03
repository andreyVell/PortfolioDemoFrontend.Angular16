import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCreatorComponent } from './person-creator.component';

describe('PersonCreatorComponent', () => {
  let component: PersonCreatorComponent;
  let fixture: ComponentFixture<PersonCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
