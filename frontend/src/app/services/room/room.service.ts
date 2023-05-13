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
    return Math.round(Math.atan2(p1.yCoordinate - p2.yCoordinate, p1.xCoordinate - p2.xCoordinate) * 180 / Math.PI) * 10 / 10;
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
    return Math.round(Math.sqrt((p1.xCoordinate - p2.xCoordinate) ** 2 + (p1.yCoordinate - p2.yCoordinate) ** 2) * 10) / 10;
  }

  downloadImage(imageUrl: string, imageName: string) {
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

  triangulatePolygon(vertices: number[]): number[][] {
    const indices = earcut(vertices);
    const triangles = [];
    for (let i = 0; i < indices.length; i += 3) {
      triangles.push([indices[i], indices[i + 1], indices[i + 2]]);
    }
    return triangles;
  }  
}