export class Layer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private savedState: ImageData;
  
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d')!;
      this.savedState = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  
    public reset(): void {
      this.ctx.putImageData(this.savedState, 0, 0);
    }
}  