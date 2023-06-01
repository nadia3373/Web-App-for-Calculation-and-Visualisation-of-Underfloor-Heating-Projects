import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  message: string = '';
  color: string = '';

  showMessage(message: string, status: string): void {
    this.message = message;
    this.color = status === 'error' ? 'red' : 'green';
  }

  hideMessage(): void {
    this.message = '';
    this.color = '';
  }
}