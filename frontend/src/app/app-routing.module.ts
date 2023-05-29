import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { DrawComponent } from './pages/draw/draw.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RoomsComponent } from './pages/rooms/rooms.component';


const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'draw', component: DrawComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'rooms', component: RoomsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }