export class PipeLayout {
    public width: number;
    public height: number;
    public loops: number;
    public offset: number = 0;
    public diameter: number = 0;
    public arcLength: number = 0;

    public innerLines: number = 0;
    public outerLines: number = 0;
    public arcs: number = 0;
    public corners: number = 0;
    public closingLine: number = 0;

    public pipeLength: number;
    public totalLength: number = 0;
    public difference: number = 0;

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
        this.difference = this.totalLength - this.pipeLength;
    }

    public toString() {
        return `width: ${this.width} height: ${this.height} turns: ${this.loops} diameter: ${this.diameter} inner length: ${this.innerLines} outer length: ${this.outerLines} circle length: ${this.arcLength} half corners: ${this.arcs} corners: ${this.corners} horizontal: ${this.closingLine} total: ${this.totalLength} diff: ${this.difference}`;
    }
}