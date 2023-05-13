import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { ApiService } from 'src/app/services/api-service/api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  private projects: Project[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    const roomId = this.route.snapshot.queryParamMap.get('r') || '';
    console.log(roomId);
    this.apiService.getProjects(roomId).subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
      error: (error) => console.error(error)
    });
  }
}
