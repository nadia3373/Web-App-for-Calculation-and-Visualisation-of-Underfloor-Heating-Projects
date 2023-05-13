import ObjectId from 'bson-objectid';
import { Point } from "./point.model";

export class Room {
    private area: number;
    private created: string;
    private _id: ObjectId;
    private name: string;
    private points: Point[];

    constructor(area: number = 0, created: string = new Date().toISOString(), _id: ObjectId = new ObjectId(), name: string = 'test', points: Point[] = []) {
      this.area = area;
      this.created = created;
      this._id = _id;
      this.name = name;
      this.points = points;
    }

    public get roomArea(): number {
      return this.area;
    }
    
    public get roomCreated(): string {
      return this.created;
    }
    
    public get roomId(): ObjectId {
      return this._id;
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
    
    public set roomId(i: ObjectId) {
      this._id = i;
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