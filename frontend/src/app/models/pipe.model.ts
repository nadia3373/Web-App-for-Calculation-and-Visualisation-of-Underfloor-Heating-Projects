import ObjectId from 'bson-objectid';

export class Pipe {
    private id: ObjectId;
    private length: number;
    private model: string;
    private oc: number;
    private power: number;
    private price: number;

    constructor(id: ObjectId = new ObjectId(), length: number,
    model: string= '', oc: number, power: number, price: number = 0) {
        this.id = id;
        this.length = length;
        this.model = model;
        this.oc = oc;
        this.power = power;
        this.price = price;
    }

    public get getLength(): number {
        return this.length;
    }

    public get getModel(): string {
        return this.model;
    }
    
    public get getPrice(): number {
        return this.price;
    }
}