import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageCreatorComponent } from './project-stage-creator.component';

describe('ProjectStageCreatorComponent', () => {
  let component: ProjectStageCreatorComponent;
  let fixture: ComponentFixture<ProjectStageCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStageCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStageCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
