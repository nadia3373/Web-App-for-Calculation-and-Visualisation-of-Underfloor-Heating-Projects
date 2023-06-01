import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawComponent } from './pages/draw/draw.component';
import { IndexComponent } from './pages/index/index.component';
import { ApiService } from './services/api-service/api.service';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomService } from './services/room/room.service';
import { DatePipe } from '@angular/common';
import { ProjectComponent } from './pages/project/project.component';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from './pages/banner/banner.component';
import { ImageService } from './services/image/image.service';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    RoomsComponent,
    DrawComponent,
    ProjectComponent,
    BannerComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ApiService, BannerComponent, DatePipe, ImageService, RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }
