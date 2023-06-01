import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Combo } from 'src/app/models/combo.model';
import { Project } from 'src/app/models/project.model';
import { ApiService } from 'src/app/services/api-service/api.service';
import { Room } from '../../models/room.model';
import { RoomService } from 'src/app/services/room/room.service';
import { Wall } from '../../models/wall.model';
import { Layout } from 'src/app/models/layout.model';
import { PipeLayout } from 'src/app/models/pipe-layout.model';
import { Point } from '../../models/point.model';
import { ThermoController } from 'src/app/models/thermocontroller.model';
import { MountingBox } from 'src/app/models/mounting-box.model';
import { forkJoin } from 'rxjs';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;
  public boxes: MountingBox[] = [];
  public combos: Combo[] = [];
  public controllers: ThermoController[] = [];
  private context!: CanvasRenderingContext2D;
  public comboIndex: number = 0;
  public controllerIndex: number = 0;
  public project: Project = new Project();
  public ready: boolean = false;
  private room: Room = new Room();
  private wall: Wall = new Wall();

  constructor(private apiService: ApiService, private imageService: ImageService, public pdfService: PdfService, private roomService: RoomService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    let room: string = this.route.snapshot.queryParamMap.get('rid') || '';
    if (room !== '') {
      this.project.room = room;
      this.loadData().then(() => {
        this.wall = this.roomService.getLongestWall(this.room.walls)!;
        this.project.box = this.boxes[0];
        this.project.combo = this.getInitialCombo();
        this.project.controller = this.controllers[this.controllerIndex];
        this.project.calculate();
        this.drawProject();
        this.project.image = this.imageService.getCroppedImage(this.canvas, this.context);
        this.ready = true;
      });
    }
  }

  public drawPipes(layout: PipeLayout, wall: Wall, shift: number) {
    let basePoint: Point = new Point();
    if (wall.position === "upper") {
      basePoint = wall.angle === 0 ? new Point(wall.points[0].x, wall.points[0].y, wall.points[0].xPx, wall.points[1].yPx) : new Point(wall.points[1].x, wall.points[1].y, wall.points[1].xPx, wall.points[1].yPx);
      basePoint.x = shift > 0 ? basePoint.x + shift / 100 : basePoint.x;
      basePoint.xPx = shift > 0 ? basePoint.xPx + shift : basePoint.xPx;
    } else if (wall.position === "left") {
      basePoint = wall.angle === 90 ? new Point(wall.points[0].x, wall.points[0].y, wall.points[0].xPx, wall.points[0].yPx) : new Point(wall.points[1].x, wall.points[1].y, wall.points[1].xPx, wall.points[1].yPx);
      basePoint.y = shift > 0 ? basePoint.y - shift / 100 : basePoint.y;
      basePoint.yPx = shift > 0 ? basePoint.yPx - shift : basePoint.yPx;
    } else if (wall.position === "lower") {
      basePoint = wall.angle === 180 ? new Point(wall.points[0].x, wall.points[0].y, wall.points[0].xPx, wall.points[0].yPx) : new Point(wall.points[1].x, wall.points[1].y, wall.points[1].xPx, wall.points[1].yPx);
      basePoint.x = shift > 0 ? basePoint.x - shift / 100 : basePoint.x;
      basePoint.xPx = shift > 0 ? basePoint.xPx - shift : basePoint.xPx;
    } else if (wall.position === "right") {
      basePoint = wall.angle === 270 ? new Point(wall.points[0].x, wall.points[0].y, wall.points[0].xPx, wall.points[0].yPx) : new Point(wall.points[1].x, wall.points[1].y, wall.points[1].xPx, wall.points[1].yPx);
      basePoint.y = shift > 0 ? basePoint.y + shift / 100 : basePoint.y;
      basePoint.yPx = shift > 0 ? basePoint.yPx + shift : basePoint.yPx;
    }
    if (basePoint !== undefined) {
      this.context.strokeStyle = 'blue';
      this.context.lineWidth = 2;
      this.context.lineCap = "square";
      this.context.beginPath();

      let x: number = wall.position === "upper" ? basePoint.xPx + 15 + layout.diameter * 100 / 2
      : wall.position === "lower" ? basePoint.xPx - 15 - layout.diameter * 100 / 2
      : wall.position === "left" ? basePoint.xPx + 15
      : basePoint.xPx - 15

      let y: number = wall.position === "upper" ? basePoint.yPx + 15
      : wall.position === "lower" ? basePoint.yPx - 15
      : wall.position === "left" ? basePoint.yPx - 15 - layout.diameter * 100 / 2
      : basePoint.yPx + 15 + layout.diameter * 100 / 2

      this.context.moveTo(x, y);

      // draw corner
      x = wall.position === "right" ? basePoint.xPx - 15 - layout.diameter * 100 / 2 : wall.position === "left" ? basePoint.xPx + 15 + layout.diameter * 100 / 2 : x
      y = wall.position === "upper" ? basePoint.yPx + 15 + layout.diameter * 100 / 2 : wall.position === "lower" ? basePoint.yPx - 15 - layout.diameter * 100 / 2 : y
      let sAngle: number = wall.position === "upper" ? 1.5 * Math.PI : wall.position === "left" ? Math.PI : wall.position === "lower" ? 0.5 * Math.PI : 0;
      let fAngle: number = wall.position === "upper" ? Math.PI : wall.position === "left" ? 0.5 * Math.PI : wall.position === "lower" ? 0 : 1.5 * Math.PI;
      let direction: boolean = true;
      this.context.arc(x, y, layout.diameter * 100 / 2, sAngle, fAngle, direction);

      // draw outer line
      x = wall.position === "upper" ? basePoint.xPx + 15 : wall.position === "lower" ? basePoint.xPx - 15 : wall.position === "left" ? basePoint.xPx + 15 + (layout.diameter + layout.outerLines) * 100 / 2 : basePoint.xPx - 15 - (layout.diameter + layout.outerLines) * 100 / 2; 
      y = wall.position === "upper" ? basePoint.yPx + 15 + (layout.diameter + layout.outerLines) * 100 / 2 : wall.position === "lower" ? basePoint.yPx - 15 - (layout.diameter + layout.outerLines) * 100 / 2 : wall.position === "left" ? basePoint.yPx - 15 : basePoint.yPx + 15;
      this.context.lineTo(x, y);

      // draw inner loops
      for (let i: number = 0; i < layout.loops; i++) {
        x = wall.position === "upper" ? basePoint.xPx + 15 + layout.diameter * 100 * (i + 0.5)
        : wall.position === "lower" ? basePoint.xPx - 15 - layout.diameter * 100 * (i + 0.5)
        : wall.position === "left" ? i % 2 === 0 ? basePoint.xPx + 15 + (layout.diameter + layout.outerLines) * 100 / 2 : basePoint.xPx + 15 + 15 + layout.diameter * 100 / 2
        : i % 2 === 0 ? basePoint.xPx - 15 - (layout.diameter + layout.outerLines) * 100 / 2 : basePoint.xPx - 15 - 15 - layout.diameter * 100 / 2; 
        
        y = wall.position === "upper" ? i % 2 === 0 ? basePoint.yPx + 15 + (layout.diameter + layout.outerLines) * 100 / 2 : basePoint.yPx + 15 + 15 + layout.diameter * 100 / 2
        : wall.position === "lower" ? i % 2 === 0 ? basePoint.yPx - 15 - (layout.diameter + layout.outerLines) * 100 / 2 : basePoint.yPx - 15 - 15 - layout.diameter * 100 / 2
        : wall.position === "left" ? basePoint.yPx - 15 - layout.diameter * 100 * (i + 0.5)
        : basePoint.yPx + 15 + layout.diameter * 100 * (i + 0.5);

        sAngle = wall.position === "upper" ? Math.PI : wall.position === "left" ? 0.5 * Math.PI : wall.position === "lower" ? 0 : 1.5 * Math.PI;
        fAngle = wall.position === "upper" ? 0 : wall.position === "left" ? 1.5 * Math.PI : wall.position === "lower" ? Math.PI : 0.5 * Math.PI;
        this.context.arc(x, y, layout.diameter * 100 / 2, sAngle, fAngle, i % 2 === 0);
      
        if (i < layout.loops - 1) {
          x = wall.position === "upper" ? x + layout.diameter * 100 / 2
          : wall.position === "lower" ? x - layout.diameter * 100 / 2
          : wall.position === "left" ? i % 2 === 0 ? basePoint.xPx + 15 + 15 + layout.diameter * 100 / 2 : basePoint.xPx + 15 + 15 + (layout.diameter / 2 + layout.innerLines / (layout.loops - 1)) * 100
          : i % 2 === 0 ? basePoint.xPx - 15 - 15 - layout.diameter * 100 / 2 : basePoint.xPx - 15 - 15 - (layout.diameter / 2 + layout.innerLines / (layout.loops - 1)) * 100; 
          
          y = wall.position === "upper" ? i % 2 === 0 ? basePoint.yPx + 15 + 15 + layout.diameter * 100 / 2 : basePoint.yPx + 15 + 15 + (layout.diameter / 2 + layout.innerLines / (layout.loops - 1)) * 100
          : wall.position === "lower" ? i % 2 === 0 ? basePoint.yPx - 15 - 15 - layout.diameter * 100 / 2 : basePoint.yPx - 15 - 15 - (layout.diameter / 2 + layout.innerLines / (layout.loops - 1)) * 100
          : wall.position === "left" ? y - layout.diameter * 100 / 2
          : y + layout.diameter * 100 / 2;

          this.context.lineTo(x, y);
        }
      }

      // draw outer line
      x = wall.position === "upper" ? basePoint.xPx + 15 + (layout.closingLine + layout.diameter) * 100 : wall.position === "lower" ? basePoint.xPx - 15 - (layout.closingLine + layout.diameter) * 100 : wall.position === "left" ? basePoint.xPx + 15 + layout.diameter * 100 / 2 : basePoint.xPx - 15 - layout.diameter * 100 / 2; 
      y = wall.position === "upper" ? basePoint.yPx + 15 + layout.diameter * 100 / 2 : wall.position === "lower" ? basePoint.yPx - 15 - layout.diameter * 100 / 2 : wall.position === "left" ? basePoint.yPx - 15 - (layout.closingLine + layout.diameter) * 100 : basePoint.yPx + 15 + (layout.closingLine + layout.diameter) * 100;

      this.context.lineTo(x, y);

      // draw corner
      x = wall.position === "upper" ? x - layout.diameter * 100 / 2 : wall.position === "lower" ? x + layout.diameter * 100 / 2 : x
      y = wall.position === "right" ? y - layout.diameter * 100 / 2 : wall.position === "left" ? y + layout.diameter * 100 / 2 : y
      sAngle = wall.position === "upper" ? 0 : wall.position === "left" ? 1.5 * Math.PI : wall.position === "lower" ? Math.PI : 0.5 * Math.PI;
      fAngle = wall.position === "upper" ? 1.5 * Math.PI : wall.position === "left" ? Math.PI : wall.position === "lower" ? 0.5 * Math.PI : 0;
      direction = true;
      
      this.context.arc(x, y, layout.diameter * 100 / 2, sAngle, fAngle, direction);

      // draw connecting line
      x = wall.position === "upper" ? basePoint.xPx + 15 + layout.diameter * 100 / 2 : wall.position === "lower" ? basePoint.xPx - 15 - layout.diameter * 100 / 2 : wall.position === "left" ? basePoint.xPx + 15 : basePoint.xPx - 15
      y = wall.position === "upper" ? basePoint.yPx + 15 : wall.position === "lower" ? basePoint.yPx - 15 : wall.position === "left" ? basePoint.yPx - 15 - layout.diameter * 100 / 2 : basePoint.yPx + 15 + layout.diameter * 100 / 2

      this.context.lineTo(x, y);

      this.context.stroke();
    }
  }

  public drawProject() {
    let layouts: Layout[] = [];
    if (this.wall !== null) {
      this.room.walls.forEach((w: Wall) => {
        if (Math.abs(w.angle - this.wall.angle) === 90) {
          let pipeLayouts: PipeLayout[] = [];
          let pipeLayouts1: PipeLayout[] = [];
          let width: number = (this.wall.length - 0.3);
          let height: number = (w.length - 0.3);
          const loops: number = Math.round((this.project.combo.length - width) / height);
          if (loops % 2 !== 0) {
            pipeLayouts = this.getPipeLayouts(width / loops, loops, width, height);
            layouts.push(new Layout(width, height, loops, this.project.combo.length, 0, pipeLayouts));
          } else {
            pipeLayouts = this.getPipeLayouts(width / (loops - 1), loops, width, height);
            layouts.push(new Layout(width, height, loops - 1, this.project.combo.length, 0, pipeLayouts));
            pipeLayouts1 = this.getPipeLayouts(width / (loops + 1), loops, width, height);
            layouts.push(new Layout(width, height, loops + 1, this.project.combo.length, 0, pipeLayouts1));
          }
          layouts.forEach((l: Layout) => l.calculateDifference());
          if (layouts.length > 0) {
            this.project.layout = layouts.reduce((min: Layout, curr: Layout) => curr.diff < min.diff ? curr : min);
          }
        }
      });
    }
    this.drawRoom(this.room);
    let shift: number = 0;
    for (let i: number = 0; i < this.project.layout.pipes.length; i++) {
      shift = i > 0 ? shift + this.project.layout.pipes[i - 1].width * 100 + this.project.layout.pipes[i].diameter * 100 : shift;
      this.drawPipes(this.project.layout.pipes[i], this.wall, shift);
    }
  }

  public drawRoom(room: Room) {
    this.context.strokeStyle = 'green';
    this.context.lineWidth = 10;
    this.context.lineCap = "square";
    for (let index: number = 1; index < room.points.length; index++) {
      this.context.beginPath();
      this.context.moveTo(room.points[index - 1].xPx, room.points[index - 1].yPx);
      this.context.lineTo(room.points[index].xPx, room.points[index].yPx);
      this.context.stroke();
    }
    this.context.beginPath();
    this.context.moveTo(room.points[room.points.length - 1].xPx, room.points[room.points.length - 1].yPx);
    this.context.lineTo(room.points[0].xPx, room.points[0].yPx);
    this.context.stroke();
  }

  public getInitialCombo(): Combo {
    const target: number = 160;
    const difference: Function = (a: number, b: number) => Math.abs(a - target) - Math.abs(b - target);
    const initialCombo: Combo = this.combos.reduce((prev, curr) => {
      const diff: number = difference(prev.power, curr.power);
      return diff < 0 ? prev : curr;
    });
    
    this.comboIndex = this.combos.indexOf(initialCombo);
    
    return initialCombo;
  }

  private getPipeLayouts(diameter: number, loops: number, width: number, height: number): PipeLayout[] {
    let pipeLayouts: PipeLayout[] = [];
    if (this.project.combo.pipes.length > 1) {
      for (let i: number = 0; i < this.project.combo.pipes.length - 1; i++) {
        let ratio: number = (width - diameter) * this.project.combo.pipes[i].length / this.project.combo.length;
        let ratio1: number = (width - diameter) * this.project.combo.pipes[i + 1].length / this.project.combo.length;
        let pipeLoops: number = Math.round(ratio / diameter);
        let pipeLoops1: number = Math.round(ratio1 / diameter);
        if (pipeLoops % 2 === 0) {
          if (this.project.combo.pipes[i].length > this.project.combo.pipes[i + 1].length) {
            pipeLoops += 1;
            pipeLoops1 -= 1;
          } else {
            pipeLoops -= 1;
            pipeLoops1 += 1;
          }
        }
        let layoutWidth: number = diameter * pipeLoops;
        let layoutWidth1: number = diameter * pipeLoops1;
        pipeLayouts.push(new PipeLayout(this.project.combo.pipes[i].length, layoutWidth, height, pipeLoops));
        pipeLayouts.push(new PipeLayout(this.project.combo.pipes[i + 1].length, layoutWidth1, height, pipeLoops1));
      }
    } else {
      if (loops % 2 !== 0) {
        pipeLayouts.push(new PipeLayout(this.project.combo.pipes[0].length, width, height, loops));
      } else {
        const l1: PipeLayout = new PipeLayout(this.project.combo.pipes[0].length, width, height, loops - 1);
        const l2: PipeLayout = new PipeLayout(this.project.combo.pipes[0].length, width, height, loops + 1);
        pipeLayouts.push(l1.difference < l2.difference ? l1 : l2);
      }
    }
    return pipeLayouts;
  }

  public loadData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      forkJoin([
        this.apiService.getCombos(this.project.room),
        this.apiService.getRooms(this.project.room),
        this.apiService.getControllers(),
        this.apiService.getBoxes()
      ]).subscribe({
        next: ([combos, rooms, controllers, boxes]: [Combo[], Room[], ThermoController[], MountingBox[]]) => {
          this.combos = combos;
          this.room = rooms[0];
          this.controllers = controllers;
          this.boxes = boxes;
          resolve();
        },
        error: (error) => reject(error)
      });
    })
  }

  onComboChange() {
    this.ready = false;
    this.project.combo = this.combos[this.comboIndex];
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawProject();
    this.project.image = this.imageService.getCroppedImage(this.canvas, this.context);
    this.project.calculate();
    this.ready = true;
  }

  onControllerChange() {
    this.ready = false;
    this.project.controller = this.controllers[this.controllerIndex];
    this.project.calculate();
    this.ready = true;
  }
}