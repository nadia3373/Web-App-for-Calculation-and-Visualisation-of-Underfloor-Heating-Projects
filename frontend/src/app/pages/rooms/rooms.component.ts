import { Component, OnInit } from '@angular/core';
import { Room } from '../draw/room.model';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms: Room[]) => {
        this.rooms = rooms;
      },
      error: (error) => console.error(error)
    });
  }
}
