import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Layer } from '../draw/layer.model';
import { Point } from '../draw/point.model';
import { Room } from './room.model';
import { RoomService } from 'src/app/services/room/room.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api-service/api.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})
export class DrawComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private currentAngle: number = 0;
  private currentPoint: Point = new Point(0, 0);
  private context!: CanvasRenderingContext2D;
  private currentDistance: number = 0;
  private isDrawing: boolean = false;
  private layers: Layer[] = [];
  private currentCoordinates: { x: number, y: number } = { x: 0, y: 0 };
  private rect!: DOMRect;
  private room: Room = new Room;

  constructor(private apiService: ApiService, private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.rect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.getGrid(100, 100);
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
    this.currentCoordinates = {x: event.clientX, y: event.clientY};
    this.currentPoint = new Point(Math.abs(this.rect.left - this.currentCoordinates.x), Math.abs(this.rect.top - this.currentCoordinates.y));
    if (Math.abs(this.room.roomPoints[this.room.roomPoints.length - 1].xCoordinate - this.currentPoint.xCoordinate) > 0 || Math.abs(this.room.roomPoints[this.room.roomPoints.length - 1].yCoordinate - this.currentPoint.yCoordinate) > 0) {
      this.currentAngle = this.roomService.calculateAngle(this.currentPoint, this.room.roomPoints[this.room.roomPoints.length - 1]);
      this.currentDistance = this.roomService.calculateDistance(this.currentPoint, this.room.roomPoints[this.room.roomPoints.length - 1]);
      this.layers[this.layers.length - 1].reset();
      this.context.restore();
      this.context.beginPath();
      this.context.moveTo(this.room.roomPoints[this.room.roomPoints.length - 1].xPx, this.room.roomPoints[this.room.roomPoints.length - 1].yPx);
      this.context.lineTo(this.currentPoint.xPx, this.currentPoint.yPx);
      this.context.strokeStyle = 'green';
      this.context.lineWidth = 10;
      this.context.lineCap = "square";
      this.context.stroke();
    }
  }

  @HostListener('mouseup', ['$event'])
  onClick = (event: MouseEvent) => {
    this.currentCoordinates = {x: event.clientX, y: event.clientY};
    this.currentPoint = new Point(Math.abs(this.rect.left - this.currentCoordinates.x), Math.abs(this.rect.top - this.currentCoordinates.y));
    if (this.room.roomPoints.length > 0 && this.room.roomPoints[0].xCoordinate === this.currentPoint.xCoordinate && this.room.roomPoints[0].yCoordinate === this.currentPoint.yCoordinate) {
      const vertices: number[] = this.room.roomPoints.flatMap(p => [p.xCoordinate, p.yCoordinate]);
      const triangles: number[][] = this.roomService.triangulatePolygon(vertices);
      this.room.roomArea = this.roomService.calculateArea(this.room.roomPoints, triangles);
      this.apiService.postRoom(this.room).subscribe({
        next: response => {
          this.roomService.downloadImage(this.layers[this.layers.length - 1].getCanvas.toDataURL('image/png'), 'canvas.png');
          // this.router.navigate(['/rooms']);
        },
        error: error => {
          this.clearAllPoints();
        }
      });
    } else {
      this.isDrawing = true;
    }
    this.room.addPoint(this.currentPoint);
    this.layers.push(new Layer(this.canvas.nativeElement));
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
    if (this.room.roomPoints.length > 1 && this.layers.length > 1) {
      this.room.roomPoints.pop();
      this.layers.pop();
      this.layers[this.layers.length - 1].reset();
      this.context.restore();
    } else {
      this.room.roomPoints = [];
      while (this.layers.length > 1) {
        this.layers.pop();
      }
      this.layers[0].reset();
      this.context.restore();
      this.isDrawing = false;
    }
  }

  private clearAllPoints() {
    console.log("works");
    this.room.roomPoints = [];
    while (this.layers.length > 1) this.layers.pop();
    this.layers[0].reset();
    this.context.restore();
    this.isDrawing = false;
  }

  private getGrid(cellWidth: number, cellHeight: number): void {
    for (let x = 0; x <= this.canvas.nativeElement.width; x += cellWidth / 10) {
      this.context.beginPath();
      this.context.moveTo(x + 0.5, 0);
      this.context.lineTo(x + 0.5, this.canvas.nativeElement.height);
      this.context.strokeStyle = '#eee';
      this.context.stroke();
    }

    for (let y = 0; y <= this.canvas.nativeElement.height; y += cellHeight / 10) {
      this.context.beginPath();
      this.context.moveTo(0, y + 0.5);
      this.context.lineTo(this.canvas.nativeElement.width, y + 0.5);
      this.context.strokeStyle = '#eee';
      this.context.stroke();
    }

    for (let x = 0; x <= this.canvas.nativeElement.width; x += cellWidth) {
      this.context.beginPath();
      this.context.moveTo(x + 0.5, 0);
      this.context.lineTo(x + 0.5, this.canvas.nativeElement.height);
      this.context.strokeStyle = '#000';
      this.context.stroke();
    }

    for (let y = 0; y <= this.canvas.nativeElement.height; y += cellHeight) {
      this.context.beginPath();
      this.context.moveTo(0, y + 0.5);
      this.context.lineTo(this.canvas.nativeElement.width, y + 0.5);
      this.context.strokeStyle = '#000';
      this.context.stroke();
    }
    this.context.save();
    this.layers.push(new Layer(this.canvas.nativeElement));
    this.context.restore();
  }
}