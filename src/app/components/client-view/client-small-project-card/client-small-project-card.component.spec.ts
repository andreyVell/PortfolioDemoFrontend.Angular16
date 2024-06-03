import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSmallProjectCardComponent } from './client-small-project-card.component';

describe('ClientSmallProjectCardComponent', () => {
  let component: ClientSmallProjectCardComponent;
  let fixture: ComponentFixture<ClientSmallProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSmallProjectCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSmallProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
