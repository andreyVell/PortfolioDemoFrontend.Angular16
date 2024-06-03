import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageReportCreatorComponent } from './project-stage-report-creator.component';

describe('ProjectStageReportCreatorComponent', () => {
  let component: ProjectStageReportCreatorComponent;
  let fixture: ComponentFixture<ProjectStageReportCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStageReportCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageReportCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
