import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ObjectID from 'bson-objectid';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Combo } from 'src/app/models/combo.model';
import { MountingBox } from 'src/app/models/mounting-box.model';
import { Pipe } from 'src/app/models/pipe.model';
import { ThermoController } from 'src/app/models/thermocontroller.model';
import { Room } from '../../models/room.model';
import { environment } from 'src/environments/environment';
import { BannerComponent } from 'src/app/pages/banner/banner.component';
import { Point } from 'src/app/models/point.model';
import { Wall } from 'src/app/models/wall.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private banner: BannerComponent) {}

  public getBoxes(): Observable<MountingBox[]> {
    return this.http.get<MountingBox[]>(environment.API_URL + '/boxes');
  }

  public getCombos(r: string): Observable<Combo[]> {
    let params: HttpParams = new HttpParams();
    if (r !== '') {
      params = params.set('r', r);
    }
  
    return this.http.get<any[]>(environment.API_URL + '/pipecombos', { params }).pipe(
      map(data => {
        return data.map(comboData => {
          const pipes: Pipe[] = comboData.pipes.map((pipeData: any) => new Pipe(pipeData.id, pipeData.length, pipeData.model, pipeData.oc, pipeData.power, pipeData.price));
          return new Combo(new ObjectID().toHexString(), comboData.length, pipes, comboData.power);
        });
      })
    );
  }

  public getControllers(): Observable<ThermoController[]> {
    return this.http.get<ThermoController[]>(environment.API_URL + '/thermocontrollers');
  }

  public getRooms(r: string = ''): Observable<Room[]> {
    let params: HttpParams = new HttpParams();
    if (r !== '') {
      params = params.set('r', r);
    }

    return this.http.get<any[]>(environment.API_URL + '/rooms', { params }).pipe(
      map(data => {
        return data.map(roomData => {
          const offPoints: Point[] = roomData.offpoints.map((pointData: Point) => new Point(pointData.x, pointData.y, pointData.xPx, pointData.yPx));
          const points: Point[] = roomData.points.map((pointData: Point) => new Point(pointData.x, pointData.y, pointData.xPx, pointData.yPx));
          const walls: Wall[] = roomData.walls.map((wallData: Wall) => new Wall(wallData["angle"], wallData["length"], new Point(wallData["points"][0].x, wallData["points"][0].y), new Point(wallData["points"][1].x, wallData["points"][1].y), wallData["position"], wallData["type"]));
          return new Room(roomData.area, roomData.created, roomData.id, roomData.image, roomData.name, roomData.offarea, offPoints, points, walls);
        });
      }),
      catchError((error) => {
        this.handleError('Произошла ошибка при получении комнат');
        return throwError(() => error);
      })
    );
  }

  private handleError(errorMessage: string): void {
    this.banner.showMessage(errorMessage, "error");
    setTimeout(() => {
      this.banner.hideMessage();
    }, 5000);
  }

  public postRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(environment.API_URL + '/rooms', room);
  }
}