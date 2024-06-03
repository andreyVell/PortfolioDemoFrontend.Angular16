import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesVisualizerComponent } from './files-visualizer.component';

describe('FilesVisualizerComponent', () => {
  let component: FilesVisualizerComponent;
  let fixture: ComponentFixture<FilesVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesVisualizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
