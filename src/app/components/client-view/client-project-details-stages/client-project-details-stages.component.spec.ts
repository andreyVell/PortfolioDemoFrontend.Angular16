import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectDetailsStagesComponent } from './client-project-details-stages.component';

describe('ClientProjectDetailsStagesComponent', () => {
  let component: ClientProjectDetailsStagesComponent;
  let fixture: ComponentFixture<ClientProjectDetailsStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientProjectDetailsStagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProjectDetailsStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
