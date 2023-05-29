import { Point } from "./point.model";
import { Wall } from "./wall.model";

export class Room {
    private area: number;
    private created: string;
    private id: string;
    private image: string;
    private name: string;
    private offarea: number;
    private offpoints: Point[];
    private points: Point[];
    private walls: Wall[];

    constructor(area: number = 0, created: string = new Date().toISOString(), id: string = '', image: string = '', name: string = 'test', offarea: number = 0, offPoints: Point[] = [], points: Point[] = [], walls: Wall[] = []) {
      this.area = area;
      this.created = created;
      this.id = id;
      this.image = image;
      this.name = name;
      this.offarea = offarea;
      this.offpoints = offPoints;
      this.points = points;
      this.walls = walls;
    }

    public get roomArea(): number {
      return this.area;
    }
    
    public get roomCreated(): string {
      return this.created;
    }
    
    public get roomId(): string {
      return this.id;
    }
    
    public get roomImage(): string {
      return this.image;
    }
    
    public get roomName(): string {
      return this.name;
    }

    public get roomOffArea(): number {
      return this.offarea;
    }

    public get roomOffPoints(): Point[] {
      return this.offpoints;
    }
    
    public get roomPoints(): Point[] {
      return this.points;
    }

    public get roomWalls(): Wall[] {
      return this.walls;
    }
    
    public set roomArea(a: number) {
      this.area = a;
    }
    
    public set roomCreated(c: string) {
      this.created = c;
    }
    
    public set roomId(i: string) {
      this.id = i;
    }

    public set roomImage(i: string) {
      this.image = i;
    }
    
    public set roomName(n: string) {
      this.name = n;
    }

    public set roomOffArea(n: number) {
      this.offarea = n;
    }

    public set roomOffPoints(p: Point[]) {
      this.offpoints = p;
    }
    
    public set roomPoints(p: Point[]) {
      this.points = p;
    }

    public set roomWalls(w: Wall[]) {
      this.walls = w;
    }
    
    addPoint(p: Point) {
      this.roomPoints.push(p);
    }
}