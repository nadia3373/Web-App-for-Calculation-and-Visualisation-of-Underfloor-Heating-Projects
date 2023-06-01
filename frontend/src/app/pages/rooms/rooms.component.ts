import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { ApiService } from 'src/app/services/api-service/api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
      }
    });
  }

  download(imageUrl: string, imageName: string) {
    fetch(imageUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const blob = new Blob([buffer], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}