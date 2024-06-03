import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProjectDetailsInfoComponent } from './client-project-details-info.component';

describe('ClientProjectDetailsInfoComponent', () => {
  let component: ClientProjectDetailsInfoComponent;
  let fixture: ComponentFixture<ClientProjectDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientProjectDetailsInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProjectDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
