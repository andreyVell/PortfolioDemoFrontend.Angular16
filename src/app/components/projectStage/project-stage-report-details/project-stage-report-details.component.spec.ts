import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageReportDetailsComponent } from './project-stage-report-details.component';

describe('ProjectStageReportDetailsComponent', () => {
  let component: ProjectStageReportDetailsComponent;
  let fixture: ComponentFixture<ProjectStageReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStageReportDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
