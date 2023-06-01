export class Layer {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public savedState: ImageData;
  
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d')!;
      this.savedState = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  
    public reset(): void {
      this.ctx.putImageData(this.savedState, 0, 0);
    }
}