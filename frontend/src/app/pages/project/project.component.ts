import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { Combo } from 'src/app/models/combo.model';
import { Pipe } from 'src/app/models/pipe.model';
import { Project } from 'src/app/models/project.model';
import { ApiService } from 'src/app/services/api-service/api.service';
import { Room } from '../draw/room.model';
import { RoomService } from 'src/app/services/room/room.service';
import { Wall } from '../draw/wall.model';
import { Layout } from 'src/app/models/layout.model';
import { PipeLayout } from 'src/app/models/pipe-layout.model';
import { Point } from '../draw/point.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  @ViewChild('canvas', { static: true })
  private canvas!: ElementRef<HTMLCanvasElement>;
  public combos: Combo[] = [];
  private context!: CanvasRenderingContext2D;
  public comboIndex: number = 0;
  public project: Project = new Project();
  private room: Room = new Room();
  private wall: Wall = new Wall();

  constructor(private apiService: ApiService, private roomService: RoomService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const project: string = this.route.snapshot.queryParamMap.get('pid') || '';
    let room: string = this.route.snapshot.queryParamMap.get('rid') || '';
    if (project !== '' && room === '') {
      this.apiService.getProjects(project, '').pipe(
        first(),
        map((response: Project[]) => response[0])
      ).subscribe({
        next: (project: Project) => {
          this.project = project;
        },
        error: (error) => {
          console.log(error);
        }
      });
      room = this.project.projectRoom;
    } else if (room !== '') {
      this.project.projectRoom = room;
    }
    this.apiService.getCombos(room).subscribe({
      next: (combos: Combo[]) => {
        this.combos = combos;
        if (this.project.projectCombo.comboPipes.length === 0) {
          this.project.projectCombo = this.getInitialCombo();
        }
        this.project.projectTotal = this.getTotal();
        this.apiService.getRooms(this.project.projectRoom).pipe(
          first(),
          map((response: Room[]) => response[0])
        ).subscribe({
          next: (room: Room) => {
            this.room = room;
            this.wall = this.roomService.getLongestWall(this.room.roomWalls)!;
            this.drawProject();
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => console.error(error)
    });
  }

  public clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
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

      let x: number = wall.position === "upper" ? basePoint.xPx + 15 + layout.d * 100 / 2
      : wall.position === "lower" ? basePoint.xPx - 15 - layout.d * 100 / 2
      : wall.position === "left" ? basePoint.xPx + 15
      : basePoint.xPx - 15

      let y: number = wall.position === "upper" ? basePoint.yPx + 15
      : wall.position === "lower" ? basePoint.yPx - 15
      : wall.position === "left" ? basePoint.yPx - 15 - layout.d * 100 / 2
      : basePoint.yPx + 15 + layout.d * 100 / 2

      this.context.moveTo(x, y);

      // draw corner
      x = wall.position === "right" ? basePoint.xPx - 15 - layout.d * 100 / 2 : wall.position === "left" ? basePoint.xPx + 15 + layout.d * 100 / 2 : x
      y = wall.position === "upper" ? basePoint.yPx + 15 + layout.d * 100 / 2 : wall.position === "lower" ? basePoint.yPx - 15 - layout.d * 100 / 2 : y
      let sAngle: number = wall.position === "upper" ? 1.5 * Math.PI : wall.position === "left" ? Math.PI : wall.position === "lower" ? 0.5 * Math.PI : 0;
      let fAngle: number = wall.position === "upper" ? Math.PI : wall.position === "left" ? 0.5 * Math.PI : wall.position === "lower" ? 0 : 1.5 * Math.PI;
      let direction: boolean = true;
      this.context.arc(x, y, layout.d * 100 / 2, sAngle, fAngle, direction);

      // draw outer line
      x = wall.position === "upper" ? basePoint.xPx + 15 : wall.position === "lower" ? basePoint.xPx - 15 : wall.position === "left" ? basePoint.xPx + 15 + (layout.d + layout.outer) * 100 / 2 : basePoint.xPx - 15 - (layout.d + layout.outer) * 100 / 2; 
      y = wall.position === "upper" ? basePoint.yPx + 15 + (layout.d + layout.outer) * 100 / 2 : wall.position === "lower" ? basePoint.yPx - 15 - (layout.d + layout.outer) * 100 / 2 : wall.position === "left" ? basePoint.yPx - 15 : basePoint.yPx + 15;
      this.context.lineTo(x, y);

      // draw inner loops
      for (let i: number = 0; i < layout.l; i++) {
        x = wall.position === "upper" ? basePoint.xPx + 15 + layout.d * 100 * (i + 0.5)
        : wall.position === "lower" ? basePoint.xPx - 15 - layout.d * 100 * (i + 0.5)
        : wall.position === "left" ? i % 2 === 0 ? basePoint.xPx + 15 + (layout.d + layout.outer) * 100 / 2 : basePoint.xPx + 15 + 15 + layout.d * 100 / 2
        : i % 2 === 0 ? basePoint.xPx - 15 - (layout.d + layout.outer) * 100 / 2 : basePoint.xPx - 15 - 15 - layout.d * 100 / 2; 
        
        y = wall.position === "upper" ? i % 2 === 0 ? basePoint.yPx + 15 + (layout.d + layout.outer) * 100 / 2 : basePoint.yPx + 15 + 15 + layout.d * 100 / 2
        : wall.position === "lower" ? i % 2 === 0 ? basePoint.yPx - 15 - (layout.d + layout.outer) * 100 / 2 : basePoint.yPx - 15 - 15 - layout.d * 100 / 2
        : wall.position === "left" ? basePoint.yPx - 15 - layout.d * 100 * (i + 0.5)
        : basePoint.yPx + 15 + layout.d * 100 * (i + 0.5);

        sAngle = wall.position === "upper" ? Math.PI : wall.position === "left" ? 0.5 * Math.PI : wall.position === "lower" ? 0 : 1.5 * Math.PI;
        fAngle = wall.position === "upper" ? 0 : wall.position === "left" ? 1.5 * Math.PI : wall.position === "lower" ? Math.PI : 0.5 * Math.PI;
        this.context.arc(x, y, layout.d * 100 / 2, sAngle, fAngle, i % 2 === 0);
      
        if (i < layout.l - 1) {
          x = wall.position === "upper" ? x + layout.d * 100 / 2
          : wall.position === "lower" ? x - layout.d * 100 / 2
          : wall.position === "left" ? i % 2 === 0 ? basePoint.xPx + 15 + 15 + layout.d * 100 / 2 : basePoint.xPx + 15 + 15 + (layout.d / 2 + layout.inner / (layout.l - 1)) * 100
          : i % 2 === 0 ? basePoint.xPx - 15 - 15 - layout.d * 100 / 2 : basePoint.xPx - 15 - 15 - (layout.d / 2 + layout.inner / (layout.l - 1)) * 100; 
          
          y = wall.position === "upper" ? i % 2 === 0 ? basePoint.yPx + 15 + 15 + layout.d * 100 / 2 : basePoint.yPx + 15 + 15 + (layout.d / 2 + layout.inner / (layout.l - 1)) * 100
          : wall.position === "lower" ? i % 2 === 0 ? basePoint.yPx - 15 - 15 - layout.d * 100 / 2 : basePoint.yPx - 15 - 15 - (layout.d / 2 + layout.inner / (layout.l - 1)) * 100
          : wall.position === "left" ? y - layout.d * 100 / 2
          : y + layout.d * 100 / 2;

          this.context.lineTo(x, y);
        }
      }

      // draw outer line
      x = wall.position === "upper" ? basePoint.xPx + 15 + (layout.closing + layout.d) * 100 : wall.position === "lower" ? basePoint.xPx - 15 - (layout.closing + layout.d) * 100 : wall.position === "left" ? basePoint.xPx + 15 + layout.d * 100 / 2 : basePoint.xPx - 15 - layout.d * 100 / 2; 
      y = wall.position === "upper" ? basePoint.yPx + 15 + layout.d * 100 / 2 : wall.position === "lower" ? basePoint.yPx - 15 - layout.d * 100 / 2 : wall.position === "left" ? basePoint.yPx - 15 - (layout.closing + layout.d) * 100 : basePoint.yPx + 15 + (layout.closing + layout.d) * 100;

      this.context.lineTo(x, y);

      // draw corner
      x = wall.position === "upper" ? x - layout.d * 100 / 2 : wall.position === "lower" ? x + layout.d * 100 / 2 : x
      y = wall.position === "right" ? y - layout.d * 100 / 2 : wall.position === "left" ? y + layout.d * 100 / 2 : y
      sAngle = wall.position === "upper" ? 0 : wall.position === "left" ? 1.5 * Math.PI : wall.position === "lower" ? Math.PI : 0.5 * Math.PI;
      fAngle = wall.position === "upper" ? 1.5 * Math.PI : wall.position === "left" ? Math.PI : wall.position === "lower" ? 0.5 * Math.PI : 0;
      direction = true;
      
      this.context.arc(x, y, layout.d * 100 / 2, sAngle, fAngle, direction);

      // draw connecting line
      x = wall.position === "upper" ? basePoint.xPx + 15 + layout.d * 100 / 2 : wall.position === "lower" ? basePoint.xPx - 15 - layout.d * 100 / 2 : wall.position === "left" ? basePoint.xPx + 15 : basePoint.xPx - 15
      y = wall.position === "upper" ? basePoint.yPx + 15 : wall.position === "lower" ? basePoint.yPx - 15 : wall.position === "left" ? basePoint.yPx - 15 - layout.d * 100 / 2 : basePoint.yPx + 15 + layout.d * 100 / 2

      this.context.lineTo(x, y);

      this.context.stroke();
    }
  }

  public drawProject() {
    let layouts: Layout[] = [];
    if (this.wall !== null) {
      this.room.roomWalls.forEach((w: Wall) => {
        // Для каждой перпендикулярной стены рассчитать шаг, вычислить длину разложенной трубы,
        // Выбрать раскладку, где длина трубы наиболее близка к самой трубе.
        if (Math.abs(w.angle - this.wall.angle) === 90) {
          let pipeLayouts: PipeLayout[] = [];
          let pipeLayouts1: PipeLayout[] = [];
          let width: number = (this.wall.length - 0.3);
          let height: number = (w.length - 0.3);
          const loops: number = Math.round((this.project.projectCombo.comboLength - width) / height);
          if (loops % 2 !== 0) {
            pipeLayouts = this.getPipeLayouts(width / loops, loops, width, height);
            layouts.push(new Layout(width, height, loops, this.project.projectCombo.comboLength, 0, pipeLayouts));
          } else {
            pipeLayouts = this.getPipeLayouts(width / (loops - 1), loops, width, height);
            layouts.push(new Layout(width, height, loops - 1, this.project.projectCombo.comboLength, 0, pipeLayouts));
            pipeLayouts1 = this.getPipeLayouts(width / (loops + 1), loops, width, height);
            layouts.push(new Layout(width, height, loops + 1, this.project.projectCombo.comboLength, 0, pipeLayouts1));
          }
          layouts.forEach((l: Layout) => l.calculateDifference());
          // layouts.forEach((l: Layout) => console.log(l));
          if (layouts.length > 0) {
            this.project.projectLayout = layouts.reduce((min: Layout, curr: Layout) => curr.diff < min.diff ? curr : min);
          }
        }
      });
    }
    this.drawRoom(this.room);
    let shift: number = 0;
    for (let i: number = 0; i < this.project.projectLayout.pipes.length; i++) {
      shift = i > 0 ? shift + this.project.projectLayout.pipes[i - 1].w * 100 + this.project.projectLayout.pipes[i].d * 100 : shift;
      this.drawPipes(this.project.projectLayout.pipes[i], this.wall, shift);
    }
    // const image = new Image();
    // image.src = room.roomImage;
    // image.onload = () => {
    //   this.context.drawImage(image, 0, 0);
    // };
  }

  public drawRoom(room: Room) {
    this.context.strokeStyle = 'green';
    this.context.lineWidth = 10;
    this.context.lineCap = "square";
    for (let index: number = 1; index < room.roomPoints.length; index++) {
      this.context.beginPath();
      this.context.moveTo(room.roomPoints[index - 1].xPx, room.roomPoints[index - 1].yPx);
      this.context.lineTo(room.roomPoints[index].xPx, room.roomPoints[index].yPx);
      this.context.stroke();
    }
    this.context.beginPath();
    this.context.moveTo(room.roomPoints[room.roomPoints.length - 1].xPx, room.roomPoints[room.roomPoints.length - 1].yPx);
    this.context.lineTo(room.roomPoints[0].xPx, room.roomPoints[0].yPx);
    this.context.stroke();
  }

  public getInitialCombo(): Combo {
    const target: number = 160;
    const difference: Function = (a: number, b: number) => Math.abs(a - target) - Math.abs(b - target);
    const initialCombo: Combo = this.combos.reduce((prev, curr) => {
      const diff: number = difference(prev.comboPower, curr.comboPower);
      return diff < 0 ? prev : curr;
    });
    
    this.comboIndex = this.combos.indexOf(initialCombo);
    
    return initialCombo;
  }

  public getTotal(): number {
    return this.project.projectCombo.comboPipes.reduce((acc: number, pipe: Pipe) => {
      return acc + pipe.getPrice;
    }, 0);
  }

  private getPipeLayouts(diameter: number, loops: number, width: number, height: number): PipeLayout[] {
    let pipeLayouts: PipeLayout[] = [];
    if (this.project.projectCombo.comboPipes.length > 1) {
      for (let i: number = 0; i < this.project.projectCombo.comboPipes.length - 1; i++) {
        let ratio: number = (width - diameter) * this.project.projectCombo.comboPipes[i].getLength / this.project.projectCombo.comboLength;
        let ratio1: number = (width - diameter) * this.project.projectCombo.comboPipes[i + 1].getLength / this.project.projectCombo.comboLength;
        let pipeLoops: number = Math.round(ratio / diameter);
        let pipeLoops1: number = Math.round(ratio1 / diameter);
        if (pipeLoops % 2 === 0) {
          if (this.project.projectCombo.comboPipes[i].getLength > this.project.projectCombo.comboPipes[i + 1].getLength) {
            pipeLoops += 1;
            pipeLoops1 -= 1;
          } else {
            pipeLoops -= 1;
            pipeLoops1 += 1;
          }
        }
        let layoutWidth: number = diameter * pipeLoops;
        let layoutWidth1: number = diameter * pipeLoops1;
        pipeLayouts.push(new PipeLayout(this.project.projectCombo.comboPipes[i].getLength, layoutWidth, height, pipeLoops));
        pipeLayouts.push(new PipeLayout(this.project.projectCombo.comboPipes[i + 1].getLength, layoutWidth1, height, pipeLoops1));
      }
    } else {
      if (loops % 2 !== 0) {
        pipeLayouts.push(new PipeLayout(this.project.projectCombo.comboPipes[0].getLength, width, height, loops));
      } else {
        const l1: PipeLayout = new PipeLayout(this.project.projectCombo.comboPipes[0].getLength, width, height, loops - 1);
        const l2: PipeLayout = new PipeLayout(this.project.projectCombo.comboPipes[0].getLength, width, height, loops + 1);
        pipeLayouts.push(l1.diff < l2.diff ? l1 : l2);
      }
    }
    return pipeLayouts;
  }

  onComboChange() {
    this.project.projectCombo = this.combos[this.comboIndex];
    this.clearCanvas();
    this.drawProject();
  }
}