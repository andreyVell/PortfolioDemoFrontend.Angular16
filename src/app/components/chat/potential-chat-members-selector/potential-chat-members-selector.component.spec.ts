import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialChatMembersSelectorComponent } from './potential-chat-members-selector.component';

describe('PotentialChatMembersSelectorComponent', () => {
  let component: PotentialChatMembersSelectorComponent;
  let fixture: ComponentFixture<PotentialChatMembersSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotentialChatMembersSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotentialChatMembersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
