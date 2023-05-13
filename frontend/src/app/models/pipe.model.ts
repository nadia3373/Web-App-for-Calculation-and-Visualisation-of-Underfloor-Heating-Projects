import ObjectId from 'bson-objectid';

export class Pipe {
    private _id: ObjectId;
    private length: number;
    private model: string;
    private oc: number;
    private power: number;
    private price: number;

    constructor(_id: ObjectId = new ObjectId(), length: number,
    model: string= '', oc: number, power: number, price: number = 0) {
        this._id = _id;
        this.length = length;
        this.model = model;
        this.oc = oc;
        this.power = power;
        this.price = price;
    }
}