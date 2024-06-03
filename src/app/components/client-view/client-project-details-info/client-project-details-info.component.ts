import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/Project/Project';
import { AdaptiveComponent } from 'src/app/models/_AdaptiveComponent/AdaptiveComponent';

@Component({
  selector: 'app-client-project-details-info',
  templateUrl: './client-project-details-info.component.html',
  styleUrls: ['./client-project-details-info.component.css']
})
export class ClientProjectDetailsInfoComponent extends AdaptiveComponent {
  @Input() project: Project = new Project();
}
