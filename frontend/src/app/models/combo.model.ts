import { Pipe } from "./pipe.model";

export class Combo {
    private length: number;
    private pipes: Pipe[];
    private power: number;

    constructor(length: number = 0, pipes: Pipe[] = [], power: number = 0) {
        this.length = length;
        this.pipes = pipes;
        this.power = power;
    }

    get comboLength(): number {
        return this.length;
    }

    get comboPipes(): Pipe[] {
        return this.pipes;
    }

    get comboPower(): number {
        return this.power;
    }

    set comboLength(l: number) {
        this.length = l;
    }

    set comboPipes(pipes: Pipe[]) {
        this.pipes = pipes;
    }

    set comboPower(power: number) {
        this.power = power;
    }

    public toString(): string {
        return this.pipes.map(pipe => pipe.getModel).join(', ')
    }
}