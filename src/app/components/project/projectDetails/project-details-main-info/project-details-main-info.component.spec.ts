import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsMainInfoComponent } from './project-details-main-info.component';

describe('ProjectDetailsMainInfoComponent', () => {
  let component: ProjectDetailsMainInfoComponent;
  let fixture: ComponentFixture<ProjectDetailsMainInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsMainInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsMainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
