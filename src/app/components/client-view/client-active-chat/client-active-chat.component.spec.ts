import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientActiveChatComponent } from './client-active-chat.component';

describe('ClientActiveChatComponent', () => {
  let component: ClientActiveChatComponent;
  let fixture: ComponentFixture<ClientActiveChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientActiveChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientActiveChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
