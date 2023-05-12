import { Point } from "./point.model";
import { Wall } from "./wall.model";

export class Room {
    area: number;
    created: string;
    id: string;
    name: string;
    walls: Wall[];

    constructor(area: number = 0, created: string = new Date().toISOString(), id: string = '', name: string = 'test', walls: Wall[] = []) {
      this.area = area;
      this.created = created;
      this.id = id;
      this.name = name;
      this.walls = walls;
    }
    
    addWall(start: Point, finish: Point) {
      this.walls.push(new Wall(finish, start));
    }
}