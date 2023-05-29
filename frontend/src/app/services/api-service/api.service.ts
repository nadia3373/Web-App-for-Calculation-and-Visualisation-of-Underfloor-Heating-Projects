import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Combo } from 'src/app/models/combo.model';
import { Pipe } from 'src/app/models/pipe.model';
import { Project } from 'src/app/models/project.model';
import { Point } from 'src/app/pages/draw/point.model';
import { Room } from 'src/app/pages/draw/room.model';
import { Wall } from 'src/app/pages/draw/wall.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL: string = environment.API_URL;

  constructor(private http: HttpClient) {}

  public getCombos(r: string): Observable<Combo[]> {
    if (r !== '') {
      const params = new HttpParams().set('r', r);
      return this.http.get<any[]>(environment.API_URL + '/pipecombos?' + params.toString()).pipe(map(data => {
          return data.map(comboData => {
            const pipes: Pipe[] = comboData.pipes.map((pipeData: any) => new Pipe(pipeData.id, pipeData.length, pipeData.model, pipeData.oc, pipeData.power, pipeData.price));
            return new Combo(comboData.length, pipes, comboData.power);
          });
        })
      );
    } else {
      return this.http.get<any[]>(environment.API_URL + '/pipecombos').pipe(map(data => {
          return data.map(comboData => {
            const pipes: Pipe[] = comboData.pipes.map((pipeData: any) => new Pipe(pipeData.id, pipeData.length, pipeData.model, pipeData.oc, pipeData.power, pipeData.price));
            return new Combo(comboData.length, pipes, comboData.power);
          });
        })
      );
    }
  }

  public getProjects(project: string = '', room: string = ''): Observable<Project[]> {
    let params = project != '' ? new HttpParams().set('project', project) : room !== '' ? new HttpParams().set('room', room) : null;
    return params !== null ? this.http.get<Project[]>(environment.API_URL + '/projects?' + params.toString()) : this.http.get<Project[]>(environment.API_URL + '/projects');
  }

  public getRooms(r: string = ''): Observable<Room[]> {
    if (r !== '') {
      const params = new HttpParams().set('r', r);
      return this.http.get<any[]>(environment.API_URL + '/rooms?' + params.toString()).pipe(map(data => {
          return data.map(roomData => {
            console.log(roomData);
            const offPoints: Point[] = roomData.offpoints.map((pointData: Point) => new Point(pointData.x, pointData.y, pointData.xPx, pointData.yPx));
            const points: Point[] = roomData.points.map((pointData: Point) => new Point(pointData.x, pointData.y, pointData.xPx, pointData.yPx));
            const walls: Wall[] = roomData.walls.map((wallData: Wall) => new Wall(wallData["angle"], wallData["length"], new Point(wallData["points"][0].x, wallData["points"][0].y), new Point(wallData["points"][1].x, wallData["points"][1].y), wallData["position"], wallData["type"]));
            return new Room(roomData.area, roomData.created, roomData.id, roomData.image, roomData.name, roomData.offarea, offPoints, points, walls);
          });
        })
      );
    } else {
      return this.http.get<any[]>(environment.API_URL + '/rooms').pipe(map(data => {
          return data.map(roomData => {
            const offPoints: Point[] = roomData.offpoints.map((pointData: Point) => new Point(pointData.x, pointData.y, pointData.xPx, pointData.yPx));
            const points: Point[] = roomData.points.map((pointData: Point) => new Point(pointData.x, pointData.y, pointData.xPx, pointData.yPx));
            const walls: Wall[] = roomData.walls.map((wallData: Wall) => new Wall(wallData["angle"], wallData["length"], new Point(wallData["points"][0].x, wallData["points"][0].y), new Point(wallData["points"][1].x, wallData["points"][1].y), wallData["position"], wallData["type"]));
            return new Room(roomData.area, roomData.created, roomData.id, roomData.image, roomData.name, roomData.offarea, offPoints, points, walls);
          });
        })
      );
    }
  }

  public getRootMessage(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/`);
  }

  public getHelloMessage(name: string): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/greet/${name}`);
  }

  public postRoom(room: Room): Observable<Room> {
    console.log(room);
    return this.http.post<Room>(environment.API_URL + '/rooms', room);
  }
}