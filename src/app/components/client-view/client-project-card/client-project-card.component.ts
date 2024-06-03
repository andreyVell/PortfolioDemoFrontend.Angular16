import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/Project/Project';

@Component({
  selector: 'app-client-project-card',
  templateUrl: './client-project-card.component.html',
  styleUrls: ['./client-project-card.component.css']
})
export class ClientProjectCardComponent {
  @Input() project: Project = new Project();

  constructor(
    private router: Router,
  ) {

  }

  public GetCompletionStatus(): string {
    switch (this.project.currentProgress) {
      case 1: {
        return 'Завершён';
      }
      case 0: {
        return 'Не начат';
      }
      case -1: {
        return '';
      }
      default: {
        return 'В процессе' + ` (${(this.project.currentProgress * 100).toFixed(2)}%)`;
      }
    }
  }

  public GetCompletionStatusClass(): string {
    switch (this.project.currentProgress) {
      case 1: {
        return 'stage-completed-color';
      }
      case 0: {
        return 'stage-not-started-color';
      }
      case -1: {
        return '';
      }
      default: {
        return 'stage-in-progress-color';
      }
    }
  }
}
