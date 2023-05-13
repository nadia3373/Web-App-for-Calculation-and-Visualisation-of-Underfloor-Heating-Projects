import { Component, OnInit } from '@angular/core';
import { Room } from '../draw/room.model';
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
      next: (rooms: Room[]) => {
        this.rooms = rooms;
      },
      error: (error) => console.error(error)
    });
  }
}