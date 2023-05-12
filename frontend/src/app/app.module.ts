import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawComponent } from './pages/draw/draw.component';
import { IndexComponent } from './pages/index/index.component';
import { ApiServiceService } from './services/api-service/api-service.service';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomService } from './services/room/room.service';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ProjectsComponent,
    RoomsComponent,
    DrawComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ApiServiceService, RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }
