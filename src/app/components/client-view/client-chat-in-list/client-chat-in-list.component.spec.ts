import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientChatInListComponent } from './client-chat-in-list.component';

describe('ClientChatInListComponent', () => {
  let component: ClientChatInListComponent;
  let fixture: ComponentFixture<ClientChatInListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientChatInListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientChatInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
