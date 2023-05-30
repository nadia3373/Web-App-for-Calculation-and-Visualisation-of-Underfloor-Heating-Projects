import { RoomService } from "src/app/services/room/room.service";
import { Point } from "./point.model";

export class Wall {
    angle: number;
    length: number;
    points: Point[];
    position: string;
    type: string;

    constructor(angle: number = 0, length: number = 0, p1: Point = new Point(), p2: Point = new Point(), position: string = '', type: string = '') {
        this.angle = angle;
        this.length = length;
        this.points = [];
        this.points.push(p1);
        this.points.push(p2);
        this.position = position;
        this.type = type;
    }

    public toString(): string {
        return `angle: ${this.angle} length: ${this.length} p1: (${this.points[0].x}; ${this.points[0].y}) p2: (${this.points[1].x}; ${this.points[1].y})`;
    }
}