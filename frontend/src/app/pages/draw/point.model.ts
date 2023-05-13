export class Point {
    private x: number;
    private y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = Math.floor(x / 10) / 10;
        this.y = Math.floor(y / 10) / 10;
    }

    public get xCoordinate() : number {
        return this.x;
    }
    
    
    public get yCoordinate() : number {
        return this.y;
    }
    
    public get xPx() : number {
        return this.x * 100;
    }
    
    
    public get yPx() : number {
        return this.y * 100;
    }
    
}