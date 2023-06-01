export class Pipe {
    public id: string;
    public length: number;
    public model: string;
    public oc: number;
    public power: number;
    public price: number;

    constructor(id: string = '', length: number,
    model: string= '', oc: number, power: number, price: number = 0) {
        this.id = id;
        this.length = length;
        this.model = model;
        this.oc = oc;
        this.power = power;
        this.price = price;
    }

    public toString(): string {
        return `model: ${this.model}, length: ${this.length}, price: ${this.price}`;
    }
}