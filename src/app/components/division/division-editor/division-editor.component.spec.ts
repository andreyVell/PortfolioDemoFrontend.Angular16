import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionEditorComponent } from './division-editor.component';

describe('DivisionEditorComponent', () => {
  let component: DivisionEditorComponent;
  let fixture: ComponentFixture<DivisionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
