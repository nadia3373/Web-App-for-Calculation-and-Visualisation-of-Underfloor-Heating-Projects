export class Point {
    x: number;
    y: number;
    xPx: number;
    yPx: number;

    constructor(x: number = -1, y: number = -1, xPx: number = -1, yPx: number = -1) {
        if (xPx >= 0 && yPx >= 0) {
            this.x = Math.floor(xPx / 10) / 10;
            this.y = Math.floor(yPx / 10) / 10;
            this.xPx = Math.floor(xPx / 10) / 10 * 100;
            this.yPx = Math.floor(yPx / 10) / 10 * 100;
        } else {
            this.x = x;
            this.y = y;
            this.xPx = x * 100;
            this.yPx = y * 100;
        }
    }
    
    public toString(): string {
        return `x: ${this.x} ${this.xPx} y: ${this.y} ${this.yPx}`
    }
}