import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Point } from 'src/app/pages/draw/point.model';
import { Room } from 'src/app/pages/draw/room.model';
import { Wall } from 'src/app/pages/draw/wall.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private room: Room;

  constructor(private http: HttpClient) {
      this.room = new Room;
    }

  createRoom(points: Point[]): boolean {
    console.log("points");
    console.log(points);
    if (points.length < 4) return false;
    for (let point = 1; point < points.length; point++) {
      this.room.addWall(points[point - 1], points[point]);
    }
    this.room.addWall(points[points.length - 1], points[0]);
    return true;
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<any[]>(environment.API_URL + '/rooms').pipe(map(data => {
        return data.map(roomData => {
          const walls: Wall[] = roomData.walls.map((wallData: any) => new Wall(wallData.finish, wallData.start, wallData.angle, wallData.length));
          return new Room(roomData.created, roomData.id, roomData.name, walls);
        });
      })
    );
  }

  saveRoom(): Observable<Room> {
    console.log(this.room);
    return this.http.post<Room>(environment.API_URL + '/rooms', this.room);
  }
}