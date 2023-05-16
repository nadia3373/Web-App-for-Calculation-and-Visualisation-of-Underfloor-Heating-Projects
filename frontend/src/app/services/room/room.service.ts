import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as earcut from 'earcut';
import { Point } from 'src/app/pages/draw/point.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient) {}

  calculateAngle(p1: Point, p2: Point): number {
    return Math.atan2(p1.yCoordinate - p2.yCoordinate, p1.xCoordinate - p2.xCoordinate) * 180 / Math.PI;
  }

  calculateArea(points: Point[], triangles: number[][]): number {
    let area = 0;
    console.log(triangles);
    triangles.forEach(triangle => {
      let AB = this.calculateDistance(points[triangle[1]], points[triangle[0]]);
      let BC = this.calculateDistance(points[triangle[2]], points[triangle[1]]);
      let CA = this.calculateDistance(points[triangle[0]], points[triangle[2]]);
      let s = (AB + BC + CA) / 2;
      area += Math.sqrt(s * (s - AB) * (s - BC) * (s - CA));
      console.log(`${AB} ${BC} ${CA} ${Math.sqrt(s * (s - AB) * (s - BC) * (s - CA))}`);
    })
    return Math.round(area * 10) / 10;
  }

  calculateDistance(p1: Point, p2: Point): number {
    return Math.sqrt((p1.xCoordinate - p2.xCoordinate) ** 2 + (p1.yCoordinate - p2.yCoordinate) ** 2);
  }

  triangulatePolygon(vertices: number[]): number[][] {
    const indices = earcut(vertices);
    const triangles = [];
    for (let i = 0; i < indices.length; i += 3) {
      triangles.push([indices[i], indices[i + 1], indices[i + 2]]);
    }
    return triangles;
  }  
}