import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionEditorComponent } from './position-editor.component';

describe('PositionEditorComponent', () => {
  let component: PositionEditorComponent;
  let fixture: ComponentFixture<PositionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
