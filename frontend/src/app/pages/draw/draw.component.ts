import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as earcut from 'earcut';
import { Layer } from '../draw/layer.model';
import { Point } from '../draw/point.model';
import { Room } from './room.model';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-canvas',
  template: `<canvas #canvas></canvas>`,
  styleUrls: ['./draw.component.css']
})
export class DrawComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private canvasRect!: DOMRect;
  private cell: Point;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean;
  private layers: Layer[];
  private locked: boolean;
  private points: Point[];
  private room: Room;

  constructor(private roomService: RoomService) {
    this.cell = new Point(0, 0);
    this.isDrawing = false;
    this.layers = [];
    this.locked = false;
    this.points = [];
    this.room = new Room;
  }

  ngOnInit(): void {
    this.canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.getGrid(100, 100);
  }

  @HostListener('window:keydown', ['$event'])
  onKey = (event: KeyboardEvent) => {
    if (this.locked) return;
    if (event.key === 'Escape') {
      this.points = [];
      while (this.layers.length > 1) this.layers.pop();
      this.layers[0].reset();
      this.ctx.restore();
      this.isDrawing = false;
    } else if (event.key === 'Backspace') {
      if (this.points.length > 1 && this.layers.length > 1) {
        this.points.pop();
        this.layers.pop();
        this.layers[this.layers.length - 1].reset();
        this.ctx.restore();
      } else {
        this.points = [];
        while (this.layers.length > 1) {
          this.layers.pop();
        }
        this.layers[0].reset();
        this.ctx.restore();
        this.isDrawing = false;
      }
      // console.log(this.points);
      // console.log(this.layers);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMove = (event: MouseEvent) => {
    if (this.locked) return;
    if (this.isDrawing) {
      const currentCell = this.getCell(event.clientX, event.clientY);
      if (Math.abs(currentCell.x - this.cell.x) > 0 || Math.abs(currentCell.y - this.cell.y) > 0) {
        const layer = this.layers[this.layers.length - 1];
        layer.reset();
        this.ctx.restore();
        this.cell = this.getCell(event.clientX, event.clientY);
        this.ctx.beginPath();
        // console.log(`coords: ${event.clientX}, ${event.clientY} start: ${(this.points[this.points.length - 1].x - 1) * 10}, ${(this.points[this.points.length - 1].y - 1) * 10} finish: ${(this.cell.x - 0.1) * 10}, ${(this.cell.y - 0.1) * 10}`);
        this.ctx.moveTo((this.points[this.points.length - 1].x) * 100, (this.points[this.points.length - 1].y) * 100);
        this.ctx.lineTo((this.cell.x) * 100, (this.cell.y) * 100);
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = "square";
        this.ctx.stroke();
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  onClick = (event: MouseEvent) => {
    if (this.locked) return;
    this.cell = this.getCell(event.clientX, event.clientY);
    if (this.points.length > 0 && this.points[0].x === this.cell.x && this.points[0].y === this.cell.y) {
      this.isDrawing = false;
      this.layers = [];
      this.locked = true;
      const vertices: number[] = this.points.flatMap(point => [point.x, point.y]);
      const triangles: number[][] = this.triangulatePolygon(vertices);
      console.log(triangles);
      this.room.area = this.roomService.calculateArea(this.points, triangles);
      console.log(this.room.area);
      if (this.roomService.createRoom(this.points)) {
        this.roomService.saveRoom().subscribe({
          next: response => {
            console.log('Room saved successfully:', response);
          },
          error: error => {
            console.error('Error saving room:', error);
          }
        });
      }
    } else {
      this.isDrawing = true;
    }
    this.points.push(this.cell);
    // console.log(this.points);
    this.layers.push(new Layer(this.canvas.nativeElement));
    // console.log(this.layers);
  }

  private getCell(x: number, y: number): Point {
    console.log(`x: ${x} y: ${y} left: ${this.canvasRect.left} top: ${this.canvasRect.top}`);
    return new Point(Math.floor(Math.abs(this.canvasRect.left - x) / 10) / 10, Math.floor(Math.abs(this.canvasRect.top - y) / 10) / 10);
  }

  private getGrid(cellWidth: number, cellHeight: number): void {
    for (let x = 0; x <= this.canvas.nativeElement.width; x += cellWidth / 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, this.canvas.nativeElement.height);
      this.ctx.strokeStyle = '#eee';
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.nativeElement.height; y += cellHeight / 10) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(this.canvas.nativeElement.width, y + 0.5);
      this.ctx.strokeStyle = '#eee';
      this.ctx.stroke();
    }

    for (let x = 0; x <= this.canvas.nativeElement.width; x += cellWidth) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, this.canvas.nativeElement.height);
      this.ctx.strokeStyle = '#000';
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.nativeElement.height; y += cellHeight) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(this.canvas.nativeElement.width, y + 0.5);
      this.ctx.strokeStyle = '#000';
      this.ctx.stroke();
    }

    this.ctx.save();
    this.layers.push(new Layer(this.canvas.nativeElement));
    console.log(this.layers);
    this.ctx.restore();
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