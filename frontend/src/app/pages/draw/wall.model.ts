import { Point } from "./point.model";

export class Wall {
    angle: number;
    finish: Point;
    length: number;
    start: Point;
    
    constructor(finish: Point, start: Point, angle: number = -1000, length: number = -1) {
        this.angle = angle;
        this.finish = finish;
        this.length = length;
        this.start = start;
        if (this.angle == -1000 && this.length == -1) { this.calculate(); }
    }
    
    calculate() {
        const dx = this.start.x - this.finish.x;
        const dy = this.start.y - this.finish.y;
        // this.length = Math.round((Math.hypot(dx, dy)) * 10) / 10;
        this.length = Math.round((Math.sqrt(dx ** 2 + dy ** 2) - 0.1) * 10) / 10;
        this.angle = Math.atan2(dy, dx) * 180 / Math.PI;
    }
}