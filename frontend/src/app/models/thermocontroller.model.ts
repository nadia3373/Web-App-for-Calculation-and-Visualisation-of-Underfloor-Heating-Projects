import ObjectId from 'bson-objectid';

export class ThermoController {
    private _id: ObjectId;
    private model: string;
    private price: number;

    constructor(_id: ObjectId = new ObjectId(), model: string= '', price: number = 0) {
        this._id = _id;
        this.model = model;
        this.price = price;
    }
}