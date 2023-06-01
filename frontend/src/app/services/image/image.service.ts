import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  public getCroppedImage(canvas: ElementRef<HTMLCanvasElement>, context: CanvasRenderingContext2D): string {
    const imageData = context.getImageData(0, 0, canvas.nativeElement.width, canvas.nativeElement.height);
    let x1 = canvas.nativeElement.width, y1 = canvas.nativeElement.height, x2 = 0, y2 = 0;
    for (let x = 0; x < canvas.nativeElement.width; x++) {
      for (let y = 0; y < canvas.nativeElement.height; y++) {
        const index = (y * canvas.nativeElement.width + x) * 4;
        if (imageData.data[index + 3] > 0) {
          x1 = Math.min(x1, x);
          y1 = Math.min(y1, y);
          x2 = Math.max(x2, x);
          y2 = Math.max(y2, y);
        }
      }
    }
    const croppedCanvas = document.createElement('canvas');
    const croppedContext: CanvasRenderingContext2D = croppedCanvas.getContext('2d') as CanvasRenderingContext2D;
    croppedCanvas.width = x2 - x1;
    croppedCanvas.height = y2 - y1;
    croppedContext.drawImage(canvas.nativeElement, x1, y1, croppedCanvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height);
    return croppedCanvas.toDataURL('image/png');
  }
}