import { Point } from "./point.model";

export class Room {
    private area: number;
    private created: string;
    private id: string;
    private image: string;
    private name: string;
    private points: Point[];

    constructor(area: number = 0, created: string = new Date().toISOString(), id: string = '', image: string = '', name: string = 'test', points: Point[] = []) {
      this.area = area;
      this.created = created;
      this.id = id;
      this.image = image;
      this.name = name;
      this.points = points;
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
    
    public get roomPoints(): Point[] {
      return this.points;
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
    
    public set roomPoints(p: Point[]) {
      this.points = p;
    }
    
    addPoint(p: Point) {
      this.roomPoints.push(p);
    }
}