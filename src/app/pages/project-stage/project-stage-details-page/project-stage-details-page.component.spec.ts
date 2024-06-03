import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageDetailsPageComponent } from './project-stage-details-page.component';

describe('ProjectStageDetailsPageComponent', () => {
  let component: ProjectStageDetailsPageComponent;
  let fixture: ComponentFixture<ProjectStageDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStageDetailsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
