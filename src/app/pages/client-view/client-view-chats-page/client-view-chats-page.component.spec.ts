import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewChatsPageComponent } from './client-view-chats-page.component';

describe('ClientViewChatsPageComponent', () => {
  let component: ClientViewChatsPageComponent;
  let fixture: ComponentFixture<ClientViewChatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewChatsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientViewChatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
