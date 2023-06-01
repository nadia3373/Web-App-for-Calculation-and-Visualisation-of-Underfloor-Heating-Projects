import { Point } from "./point.model";
import { Wall } from "./wall.model";

export class Room {
    public area: number;
    public created: string;
    public id: string;
    public image: string;
    public name: string;
    public offarea: number;
    public offpoints: Point[];
    public points: Point[];
    public walls: Wall[];

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
}