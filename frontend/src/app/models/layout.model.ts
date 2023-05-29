import { PipeLayout } from "./pipe-layout.model"

export class Layout {
    private pipeLayouts: PipeLayout[] = []
    private width: number
    private height: number
    private loops: number
    private length: number;
    private difference: number

    constructor(width: number = 0, height: number = 0, loops: number = 0, length: number = 0, difference: number = 0, pipeLayouts: PipeLayout[] = []) {
        this.pipeLayouts = pipeLayouts;
        this.width = width;
        this.height = height;
        this.loops = loops;
        this.length = length;
        this.difference = difference;
    }

    public get diff(): number {
        return this.difference;
    }

    public get pipes(): PipeLayout[] {
        return this.pipeLayouts;
    }

    public calculateDifference() {
        this.difference = this.pipeLayouts.reduce((sum, pipeLayout) => sum + pipeLayout.diff, 0);
    }

    public toString() {
        return `${this.pipeLayouts} ${this.width} ${this.height} ${this.loops}`;
    }
}