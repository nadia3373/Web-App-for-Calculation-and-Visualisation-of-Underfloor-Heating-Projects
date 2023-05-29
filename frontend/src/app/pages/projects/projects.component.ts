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
  projects: Project[] = [];
  project: string = '';
  room: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.room = this.route.snapshot.queryParamMap.get('r') || '';
    if (this.room !== '') {
      this.apiService.getProjects('', this.room).subscribe({
        next: (projects: Project[]) => {
          this.projects = projects;
        },
        error: (error) => console.error(error)
      });
    } else {
      this.project = this.route.snapshot.queryParamMap.get('project') || '';
      if (this.project !== '') {
        this.apiService.getProjects(this.project, '').subscribe({
          next: (projects: Project[]) => {
            this.projects = projects;
          },
          error: (error) => console.error(error)
        });
      }
    }
  }

  download(imageUrl: string, imageName: string) {
    fetch(imageUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const blob = new Blob([buffer], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}
