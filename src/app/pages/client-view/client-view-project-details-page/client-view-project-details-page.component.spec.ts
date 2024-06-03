import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewProjectDetailsComponent } from './client-view-project-details-page.component';

describe('ClientViewProjectDetailsComponent', () => {
  let component: ClientViewProjectDetailsComponent;
  let fixture: ComponentFixture<ClientViewProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewProjectDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientViewProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
