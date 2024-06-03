import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientNavigationHeaderComponent } from './client-navigation-header.component';

describe('ClientNavigationHeaderComponent', () => {
  let component: ClientNavigationHeaderComponent;
  let fixture: ComponentFixture<ClientNavigationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientNavigationHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientNavigationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
