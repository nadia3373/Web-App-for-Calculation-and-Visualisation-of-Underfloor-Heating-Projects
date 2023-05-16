import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Point } from 'src/app/pages/draw/point.model';
import { Room } from 'src/app/pages/draw/room.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  getProjects(r: string): Observable<Project[]> {
    if (r !== '') {
      const params = new HttpParams().set('r', r);
      return this.http.get<Project[]>(environment.API_URL + '/projects?' + params.toString());
    }
    return this.http.get<Project[]>(environment.API_URL + '/projects');
  }

  public getRooms(): Observable<Room[]> {
    return this.http.get<any[]>(environment.API_URL + '/rooms').pipe(map(data => {
      console.log(data);
        return data.map(roomData => {
          const points: Point[] = roomData.points.map((pointData: any) => new Point(pointData.x, pointData.y));
          return new Room(roomData.area, roomData.created, roomData.id, roomData.image, roomData.name, points);
        });
      })
    );
  }

  public getRootMessage(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/`);
  }

  public getHelloMessage(name: string): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/greet/${name}`);
  }

  public postRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(environment.API_URL + '/rooms', room);
  }
}