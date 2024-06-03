import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInListComponent } from './chat-in-list.component';

describe('ChatInListComponent', () => {
  let component: ChatInListComponent;
  let fixture: ComponentFixture<ChatInListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatInListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
