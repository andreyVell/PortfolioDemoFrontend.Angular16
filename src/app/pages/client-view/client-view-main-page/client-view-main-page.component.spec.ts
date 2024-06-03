import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewMainComponent } from './client-view-main-page.component';

describe('ClientViewMainComponent', () => {
  let component: ClientViewMainComponent;
  let fixture: ComponentFixture<ClientViewMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientViewMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
