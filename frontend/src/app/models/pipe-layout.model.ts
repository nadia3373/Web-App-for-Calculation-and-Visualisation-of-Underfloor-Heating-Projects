export class PipeLayout {
    private width: number;
    private height: number;
    private loops: number;
    private offset: number = 0;
    private diameter: number = 0;
    private arcLength: number = 0;

    private innerLines: number = 0;
    private outerLines: number = 0;
    private arcs: number = 0;
    private corners: number = 0;
    private closingLine: number = 0;

    private pipeLength: number;
    private totalLength: number = 0;
    private difference: number = 0;

    constructor(pipeLength: number = 0, width: number = 0, height: number = 0, loops: number = 0) {
        this.pipeLength = pipeLength;
        this.width = width;
        this.height = height;
        this.loops = loops;
        this.offset = 0.15;
        this.diameter = this.width / this.loops;
        this.arcLength = Math.PI * this.diameter;
        this.innerLines = (this.height - this.offset - this.diameter) * (this.loops - 1);
        this.outerLines = (this.height - this.diameter) * 2;
        this.arcs = this.arcLength / 2 * this.loops;
        this.corners = this.arcLength / 4 * 2;
        this.closingLine = this.width - this.diameter;
        this.totalLength = this.innerLines + this.outerLines + this.arcs + this.corners + this.closingLine;
        this.difference = Math.abs(this.totalLength - this.pipeLength);
    }

    public get d(): number {
        return this.diameter;
    }

    public get diff(): number {
        return this.difference;
    }

    public get h(): number {
        return this.height;
    }

    public get closing(): number {
        return this.closingLine;
    }

    public get inner(): number {
        return this.innerLines;
    }

    public get off(): number {
        return this.offset;
    }

    public get outer(): number {
        return this.outerLines;
    }

    public get l(): number {
        return this.loops;
    }

    public get w(): number {
        return this.width;
    }

    public toString() {
        return `width: ${this.width} height: ${this.height} turns: ${this.loops} diameter: ${this.diameter} inner length: ${this.innerLines} outer length: ${this.outerLines} circle length: ${this.arcLength} half corners: ${this.arcs} corners: ${this.corners} horizontal: ${this.closingLine} total: ${this.totalLength} diff: ${this.difference}`;
    }
}