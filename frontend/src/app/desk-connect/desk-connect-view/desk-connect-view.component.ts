import { Component, OnInit } from '@angular/core';
import { DeskApiService } from '../../services/desk-api.service';
import { Desk } from '../../models/DeskModel';

@Component({
  selector: 'app-desk-connect-view',
  templateUrl: './desk-connect-view.component.html',
  styleUrl: './desk-connect-view.component.css'
})
export class DeskConnectViewComponent {
  desks: string[] = [];

  constructor(private deskApiService: DeskApiService) {}

  
  loadDesks(): void {
    this.deskApiService.getDesks().subscribe({
      next: (data) => {
        this.desks = data;
      },
      error: (error) => {
        console.error('Error loading desks', error);
      }
    });
  }

  deskInfo: Desk | null=null;

  loadDeskDetails(id: string) {
    this.deskApiService.getDeskInfo(id).subscribe ( data => {
      this.deskInfo = data;
    })
  }
}