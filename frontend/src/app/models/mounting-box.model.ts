export class MountingBox {
    public id: string;
    public model: string;
    public price: number;

    constructor(id: string = '', model: string= '', price: number = 0) {
        this.id = id;
        this.model = model;
        this.price = price;
    }
}