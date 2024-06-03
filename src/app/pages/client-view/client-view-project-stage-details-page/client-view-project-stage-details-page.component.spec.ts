import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewProjectStageDetailsComponent } from './client-view-project-stage-details-page.component';

describe('ClientViewProjectStageDetailsComponent', () => {
  let component: ClientViewProjectStageDetailsComponent;
  let fixture: ComponentFixture<ClientViewProjectStageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewProjectStageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientViewProjectStageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
