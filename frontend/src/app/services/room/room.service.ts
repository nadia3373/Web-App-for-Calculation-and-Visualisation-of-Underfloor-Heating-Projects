import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as earcut from 'earcut';
import { Point } from 'src/app/pages/draw/point.model';
import { Wall } from 'src/app/pages/draw/wall.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient) {}

  calculateAngle(p1: Point, p2: Point): number {
    return (360 - Math.atan2(p1.y - p2.y, p1.x - p2.x) * 180 / Math.PI) % 360;
  }

  calculateArea(points: Point[], triangles: number[][]): number {
    let area = 0;
    triangles.forEach(triangle => {
      let AB = this.calculateDistance(points[triangle[1]], points[triangle[0]]);
      let BC = this.calculateDistance(points[triangle[2]], points[triangle[1]]);
      let CA = this.calculateDistance(points[triangle[0]], points[triangle[2]]);
      let s = (AB + BC + CA) / 2;
      area += Math.sqrt(s * (s - AB) * (s - BC) * (s - CA));
    })
    return Math.round(area * 10) / 10;
  }

  calculateDistance(p1: Point, p2: Point): number {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  getLongestWall(walls: Wall[]) {
    return walls.length === 0 ? null : walls.reduce((max, curr) => {
      return curr.length > max.length ? curr : max;
    });
  }

  scalePolygon(points: Point[], offset: number): Point[] {
    let offpoints: Point[] = [];
    offpoints.push(points[0]);
    for(let index = 1; index < points.length; index++) {
      let x = points[index].x === offpoints[0].x ? points[index].x : offpoints[0].x > points[index].x ? points[index].x + offset : points[index].x - offset;
      let y = points[index].y === offpoints[0].y ? points[index].y : offpoints[0].y > points[index].y ? points[index].y + offset : points[index].y - offset;
      offpoints.push(new Point(x, y, -1, -1));
    }
    return offpoints;
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