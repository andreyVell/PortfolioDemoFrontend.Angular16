import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLocalFilesVisualizerComponent } from './selected-local-files-visualizer.component';

describe('SelectedLocalFilesVisualizerComponent', () => {
  let component: SelectedLocalFilesVisualizerComponent;
  let fixture: ComponentFixture<SelectedLocalFilesVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedLocalFilesVisualizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedLocalFilesVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
