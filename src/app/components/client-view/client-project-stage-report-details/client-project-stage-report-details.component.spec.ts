import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectStageReportDetailsComponent } from './client-project-stage-report-details.component';

describe('ClientProjectStageReportDetailsComponent', () => {
  let component: ClientProjectStageReportDetailsComponent;
  let fixture: ComponentFixture<ClientProjectStageReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientProjectStageReportDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProjectStageReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
