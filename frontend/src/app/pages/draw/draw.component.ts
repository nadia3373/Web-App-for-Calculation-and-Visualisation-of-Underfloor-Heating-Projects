import { ApiService } from 'src/app/services/api-service/api.service';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Layer } from '../../models/layer.model';
import { Point } from '../../models/point.model';
import { Room } from '../../models/room.model';
import { RoomService } from 'src/app/services/room/room.service';
import { Router } from '@angular/router';
import { Wall } from '../../models/wall.model';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent {
  @ViewChild('gridCanvas', { static: true })
  gridCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('userCanvas', { static: true })
  userCanvas!: ElementRef<HTMLCanvasElement>;
  private currentAngle: number = 0;
  private currentPoint: Point = new Point(0, 0);
  private context!: CanvasRenderingContext2D;
  private currentDistance: number = 0;
  private isDrawing: boolean = false;
  private layers: Layer[] = [];
  private currentCoordinates: { x: number, y: number } = { x: 0, y: 0 };
  private rect!: DOMRect;
  private room: Room = new Room();
  private walls: Point[] = [];

  constructor(private apiService: ApiService, private imageService: ImageService, private roomService: RoomService, private router: Router) {}

  public ngOnInit(): void {
    this.rect = this.userCanvas.nativeElement.getBoundingClientRect();
    this.gridCanvas.nativeElement.width = this.gridCanvas.nativeElement.offsetWidth;
    this.gridCanvas.nativeElement.height = this.gridCanvas.nativeElement.offsetHeight;
    this.userCanvas.nativeElement.width = this.userCanvas.nativeElement.offsetWidth;
    this.userCanvas.nativeElement.height = this.userCanvas.nativeElement.offsetHeight;
    this.context = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.getGrid(100, 100);
    this.context = this.userCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }

  @HostListener('window:keydown', ['$event'])
  onKey = (event: KeyboardEvent) => {
    this.isDrawing && (
      event.key === 'Escape' ? this.clearAllPoints() :
      event.key === 'Backspace' ? this.clearPoint() :
      null
    );
  }

  @HostListener('mousemove', ['$event'])
  onMove = (event: MouseEvent) => {
    if (!this.isDrawing) return;
    this.currentPoint = this.createPoint(event);
    if (Math.abs(this.room.points[this.room.points.length - 1].x - this.currentPoint.x) > 0 || Math.abs(this.room.points[this.room.points.length - 1].y - this.currentPoint.y) > 0) {
      this.currentAngle = this.roomService.calculateAngle(this.currentPoint, this.room.points[this.room.points.length - 1]);
      this.currentDistance = this.roomService.calculateDistance(this.currentPoint, this.room.points[this.room.points.length - 1]);
      this.layers[this.layers.length - 1].reset();
      this.context.restore();
      this.context.beginPath();
      this.context.moveTo(this.room.points[this.room.points.length - 1].xPx, this.room.points[this.room.points.length - 1].yPx);
      this.context.lineTo(this.currentPoint.xPx, this.currentPoint.yPx);
      this.context.strokeStyle = 'green';
      this.context.lineWidth = 10;
      this.context.lineCap = "square";
      this.context.stroke();
    }
  }

  @HostListener('mouseup', ['$event'])
  onClick = (event: MouseEvent) => {
    this.currentPoint = this.createPoint(event);
    this.walls.push(this.currentPoint);
    if (this.walls.length === 2) {
      this.room.walls.push(new Wall(this.currentAngle, this.roomService.calculateDistance(this.walls[0], this.walls[1]), this.walls[0], this.walls[1]));
      this.walls[0] = this.walls[1];
      this.walls.pop();
    }
    if (this.room.points.length > 0 && this.room.points[0].x === this.currentPoint.x && this.room.points[0].y === this.currentPoint.y) {
      let vertices: number[] = this.room.points.flatMap(p => [p.x, p.y]);
      let triangles: number[][] = this.roomService.triangulatePolygon(vertices);
      this.room.area = this.roomService.calculateArea(this.room.points, triangles);
      this.room.offpoints = this.roomService.scalePolygon(this.room.points, 0.3);
      vertices = this.room.offpoints.flatMap(p => [p.x, p.y]);
      triangles = this.roomService.triangulatePolygon(vertices);
      this.room.offarea = this.roomService.calculateArea(this.room.offpoints, triangles);
      this.room.image = this.imageService.getCroppedImage(this.userCanvas, this.context);
      this.room.walls.forEach((w: Wall) => {
        w.type = w.angle === 0 || w.angle === 180 ? "horizontal" : w.angle === 90 || w.angle === 270 ? "vertical" : "diagonal";
      });
      this.room.walls.forEach((w1: Wall, index1: number) => {
        if (!w1.position) {
          for (let index2 = index1 + 1; index2 < this.room.walls.length; index2++) {
            const w2: Wall = this.room.walls[index2];
            if (!w2.position && w1 !== w2) {
              if (w1.type === "horizontal" && w2.type === "horizontal") {
                if (w1.points[0].y < w2.points[0].y) {
                  w1.position = "upper";
                  w2.position = "lower";
                } else {
                  w2.position = "upper";
                  w1.position = "lower";
                }
              } else if (w1.type === "vertical" && w2.type === "vertical") {
                if (w1.points[0].x < w2.points[0].x) {
                  w1.position = "left";
                  w2.position = "right";
                } else {
                  w2.position = "left";
                  w1.position = "right";
                }
              } else if (w1.type === "diagonal" && w2.type === "diagonal") {
                if (w1.points[0].y < w2.points[0].y || w1.points[0].x < w2.points[0].x) {
                  w1.position = "left";
                  w2.position = "right";
                } else {
                  w2.position = "left";
                  w1.position = "right";
                }
              }
            }
          }
        }
      });
      this.apiService.postRoom(this.room).subscribe({
        next: response => {
          this.router.navigate(['/rooms']);
        },
        error: error => {
          this.clearAllPoints();
        }
      });
    } else {
      this.isDrawing = true;
    }
    this.room.points.push(this.currentPoint);
    this.layers.push(new Layer(this.userCanvas.nativeElement));
  }
  
  public get angle(): number {
    return this.currentAngle;
  }
  
  public get distance(): number {
    return this.currentDistance;
  }
  
  public get status(): boolean {
    return this.isDrawing;
  }
  
  public get coordinates(): { x: number, y: number } {
    return this.currentCoordinates;
  }
  
  public get point(): Point {
    return this.currentPoint;
  }

  private clearPoint() {
    if (this.room.points.length > 1 && this.layers.length > 1) {
      this.room.points.pop();
      this.layers.pop();
      this.layers[this.layers.length - 1].reset();
      this.room.walls.pop();
      this.walls.pop();
    } else {
      this.clearAllPoints();
    }
  }

  private clearAllPoints() {
    this.room.points = [];
    while (this.layers.length > 1) this.layers.pop();
    this.layers[0].reset();
    this.isDrawing = false;
    this.room.walls = [];
    this.walls = [];
  }

  private createPoint(event: MouseEvent): Point {
    this.currentCoordinates = {x: event.clientX, y: event.clientY};
    return new Point(-1, -1, Math.abs(this.rect.left - this.currentCoordinates.x), Math.abs(this.rect.top - this.currentCoordinates.y));
  }

  private getGrid(cellWidth: number, cellHeight: number): void {
    this.context.strokeStyle = '#eee';
    for (let x = 0; x <= this.gridCanvas.nativeElement.width; x += cellWidth / 10) {
      this.context.beginPath();
      this.context.moveTo(x + 0.5, 0);
      this.context.lineTo(x + 0.5, this.gridCanvas.nativeElement.height);
      this.context.stroke();
    }
    for (let y = 0; y <= this.gridCanvas.nativeElement.height; y += cellHeight / 10) {
      this.context.beginPath();
      this.context.moveTo(0, y + 0.5);
      this.context.lineTo(this.gridCanvas.nativeElement.width, y + 0.5);
      this.context.stroke();
    }
    this.context.strokeStyle = '#000';
    for (let x = 0; x <= this.gridCanvas.nativeElement.width; x += cellWidth) {
      this.context.beginPath();
      this.context.moveTo(x + 0.5, 0);
      this.context.lineTo(x + 0.5, this.gridCanvas.nativeElement.height);
      this.context.stroke();
    }
    for (let y = 0; y <= this.gridCanvas.nativeElement.height; y += cellHeight) {
      this.context.beginPath();
      this.context.moveTo(0, y + 0.5);
      this.context.lineTo(this.gridCanvas.nativeElement.width, y + 0.5);
      this.context.stroke();
    }
  }
}