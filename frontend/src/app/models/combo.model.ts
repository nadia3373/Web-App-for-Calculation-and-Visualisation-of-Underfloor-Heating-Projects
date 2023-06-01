import { Pipe } from "./pipe.model";

export class Combo {
    public id: string;
    public length: number;
    public pipes: Pipe[];
    public power: number;

    constructor(id: string = '', length: number = 0, pipes: Pipe[] = [], power: number = 0) {
        this.id = id;
        this.length = length;
        this.pipes = pipes;
        this.power = power;
    }

    public get name(): string {
        return this.pipes.map(pipe => pipe.model).join(', ')
    }
}