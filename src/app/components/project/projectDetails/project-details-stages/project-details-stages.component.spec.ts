import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsStagesComponent } from './project-details-stages.component';

describe('ProjectDetailsStagesComponent', () => {
  let component: ProjectDetailsStagesComponent;
  let fixture: ComponentFixture<ProjectDetailsStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsStagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
